import { Injectable } from "@nestjs/common";
import { Between, getManager, getRepository } from "typeorm";
//ENTITY
import { InteractionHeader } from "../../entity/interaction_header.entity";
import { InteractionHeaderHistory } from "../../entity/interaction_header_history.entity";
import { InteractionHeaderHistoryToday } from "../../entity/interaction_header_history_today.entity";

import { LibsService } from "../libs/services/lib.service";
import { ParamGeneral } from "./dto/dashboard.dto";
@Injectable()
export class DashboardService {
  constructor(private readonly libService: LibsService) {}

  generateWhere(payload: ParamGeneral, date: string) {
    const nowDate = this.libService.convertDate(new Date());
    let where = {};
    if (nowDate == payload.dateFrom) {
      where[date] = Between(
        new Date(`${nowDate} 00:00:00`),
        new Date(`${nowDate} 23:59:59`)
      );
    } else {
      where[date] = Between(
        new Date(`${payload.dateFrom} 00:00:00`),
        new Date(`${payload.dateTo} 23:59:59`)
      );
    }

    if (payload.agentUsername != "0") {
      where["agentUsername"] = payload.agentUsername;
    }

    if (payload.channelId != "0") {
      where["channelId"] = payload.channelId;
    }
    return where;
  }

  async getData(payload: ParamGeneral) {
    try {
      let caseInResult = await this.caseIn(payload);
      if (caseInResult.isError) {
        return caseInResult;
      }

      let offeredResult = await this.offered(payload);
      if (offeredResult.isError) {
        return offeredResult;
      }

      let totalQueueResult = await this.totalQueue();
      if (totalQueueResult.isError) {
        return totalQueueResult;
      }

      let ahtResult = await this.aht(payload);
      if (ahtResult.isError) {
        return ahtResult;
      }

      let trafficResult = await this.traffic(payload);
      if (trafficResult.isError) {
        return trafficResult;
      }

      let output = {
        caseIn: caseInResult.data,
        offered: offeredResult.data,
        totalQueue: totalQueueResult.data,
        AHT: ahtResult.data,
        traffic: trafficResult.data,
      };
      return { isError: false, data: output, statusCode: 200 };
    } catch (error) {
      console.error(error);
      return { isError: true, data: error.message, statusCode: 500 };
    }
  }

  async caseIn(payload: ParamGeneral) {
    try {
      const nowDate = this.libService.convertDate(new Date());

      let countHistory = 0;
      let countToday = 0;

      let repoHistory;
      let repoHeader = getRepository(InteractionHeader);
      if (nowDate == payload.dateFrom) {
        repoHistory = getRepository(InteractionHeaderHistoryToday);
      } else {
        repoHistory = getRepository(InteractionHeaderHistory);
      }

      let where = this.generateWhere(payload, "startDate");

      countToday = await repoHeader.count({
        where: where,
      });

      countHistory = await repoHistory.count({
        where: where,
      });

      return {
        isError: false,
        data: countHistory + countToday,
        statusCode: 200,
      };
    } catch (error) {
      console.error(error);
      return { isError: true, data: error.message, statusCode: 500 };
    }
  }

  async offered(payload: ParamGeneral) {
    try {
      const nowDate = this.libService.convertDate(new Date());

      let countHistory = 0;

      let repoHistory;
      if (nowDate == payload.dateFrom) {
        repoHistory = getRepository(InteractionHeaderHistoryToday);
      } else {
        repoHistory = getRepository(InteractionHeaderHistory);
      }

      let where = this.generateWhere(payload, "submitCwcDate");

      countHistory = await repoHistory.count({
        where: where,
      });

      return {
        isError: false,
        data: countHistory,
        statusCode: 200,
      };
    } catch (error) {
      console.error(error);
      return { isError: true, data: error.message, statusCode: 500 };
    }
  }

  async totalQueue() {
    try {
      let repo = getRepository(InteractionHeader);
      let count = await repo.count();

      return {
        isError: false,
        data: count,
        statusCode: 200,
      };
    } catch (error) {
      console.error(error);
      return { isError: true, data: error.message, statusCode: 500 };
    }
  }

  async aht(payload: ParamGeneral) {
    try {
      const nowDate = this.libService.convertDate(new Date());
      let table;
      let dateFrom;
      let dateTo;
      let where = "";
      if (nowDate == payload.dateFrom) {
        table = "interaction_header_history_today";
      } else {
        table = "interaction_header_history";
        dateFrom = payload.dateFrom;
        dateTo = payload.dateTo;
        where = `WHERE submitCwcDate BETWEEN "${dateFrom} 00:00:00" AND "${dateTo} 23:59:59"`;
      }

      const entityManager = getManager();
      let query = `SELECT IFNULL(SEC_TO_TIME(ROUND(AVG(TIMESTAMPDIFF(SECOND,pickupDate,submitCwcDate)),0)),"00:00:00") as result FROM ${table} ${where}`;
      if (payload.channelId != "0") {
        if (where == "") {
          query += `WHERE channelId='${payload.channelId}'`;
        } else {
          query += ` AND channelId='${payload.channelId}'`;
        }
      }
      if (payload.agentUsername != "0") {
        if (where == "") {
          query += `WHERE agentUsername='${payload.agentUsername}'`;
        } else {
          query += ` AND agentUsername='${payload.agentUsername}'`;
        }
      }

      let result = await entityManager.query(query);
      return {
        isError: false,
        data: result[0].result,
        statusCode: 200,
      };
    } catch (error) {
      console.error(error);
      return { isError: true, data: error.message, statusCode: 500 };
    }
  }

  async traffic(payload: ParamGeneral) {
    try {
      const nowDate = this.libService.convertDate(new Date());
      let table;
      let dateFrom;
      let dateTo;
      let where = "";
      let select = "";
      let groupBy = "";

      if (nowDate == payload.dateFrom) {
        table = "interaction_header_history_today";
        select = "SELECT hour(startDate) as time,count(1) as total";
        groupBy = "group by hour(startDate)";
        dateFrom = nowDate;
        dateTo = nowDate;
        where = `WHERE startDate BETWEEN "${dateFrom} 00:00:00" AND "${dateTo} 23:59:59"`;
      } else {
        table = "interaction_header_history";
        select = "SELECT date(startDate) as time,count(1) as total";
        groupBy = "group by date(startDate)";
        dateFrom = payload.dateFrom;
        dateTo = payload.dateTo;
        where = `WHERE startDate BETWEEN "${dateFrom} 00:00:00" AND "${dateTo} 23:59:59"`;
      }

      if (payload.channelId != "0") {
        if (where == "") {
          where += `WHERE channelId='${payload.channelId}'`;
        } else {
          where += ` AND channelId='${payload.channelId}'`;
        }
      }
      if (payload.agentUsername != "0") {
        if (where == "") {
          where += `WHERE agentUsername='${payload.agentUsername}'`;
        } else {
          where += ` AND agentUsername='${payload.agentUsername}'`;
        }
      }
      const entityManager = getManager();
      let queryHistory = `${select} from ${table} ${where} ${groupBy}`;
      let queryHeader = `${select} from interaction_header ${where} ${groupBy}`;

      let resultHistory = await entityManager.query(queryHistory);
      let resultHeader = await entityManager.query(queryHeader);
      if (nowDate != payload.dateFrom) {
        resultHistory.map((item) => {
          const container = item;
          container.time = this.libService.convertDate(item.time);
          return container;
        });

        resultHeader.map((item) => {
          const container = item;
          container.time = this.libService.convertDate(item.time);
          return container;
        });
      }

      resultHeader.forEach((element) => {
        const index = resultHistory.findIndex((x) => x.time == element.time);
        resultHistory[index].total = (
          Number(resultHistory[index].total) + Number(element.total)
        ).toString();
      });

      return {
        isError: false,
        data: resultHistory,
        statusCode: 200,
      };
    } catch (error) {
      console.error(error);
      return { isError: true, data: error.message, statusCode: 500 };
    }
  }
}