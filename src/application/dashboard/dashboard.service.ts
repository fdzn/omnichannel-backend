import { Injectable } from "@nestjs/common";
import { Between, getManager, getRepository } from "typeorm";
//ENTITY
import { InteractionHeader } from "../../entity/interaction_header.entity";
import { InteractionHeaderHistory } from "../../entity/interaction_header_history.entity";
import { InteractionHeaderHistoryToday } from "../../entity/interaction_header_history_today.entity";
import { Setting } from "../../entity/setting.entity";
import { LibsService } from "../libs/services/lib.service";
import {
  ParamGeneral,
  ParamLogInteraction,
  ParamTotalHandled,
} from "./dto/dashboard.dto";
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

  async art(payload: ParamGeneral) {
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
      let query = `SELECT IFNULL(SEC_TO_TIME(ROUND(AVG(TIMESTAMPDIFF(SECOND,pickupDate,frDate)),0)),"00:00:00") as result FROM ${table} ${where}`;
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
      console.log(query);

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

  async scr(payload: ParamGeneral) {
    try {
      const nowDate = this.libService.convertDate(new Date());

      let repoHistory;
      if (nowDate == payload.dateFrom) {
        repoHistory = getRepository(InteractionHeaderHistoryToday);
      } else {
        repoHistory = getRepository(InteractionHeaderHistory);
      }

      let where = this.generateWhere(payload, "submitCwcDate");

      let countOffered = 0;
      let countABD = 0;
      let scr = 0;
      countOffered = await repoHistory.count({
        where: where,
      });

      where["caseOut"] = 0;
      countABD = await repoHistory.count({
        where: where,
      });

      if (countOffered != 0) {
        scr = (countOffered / countABD) * 100;
      }
      return {
        isError: false,
        data: scr,
        statusCode: 200,
      };
    } catch (error) {
      console.error(error);
      return { isError: true, data: error.message, statusCode: 500 };
    }
  }

  async logInteraction(payload: ParamLogInteraction) {
    try {
      const nowDate = this.libService.convertDate(new Date());

      let repoHistory;
      if (nowDate == payload.dateFrom) {
        repoHistory = getRepository(InteractionHeaderHistoryToday);
      } else {
        repoHistory = getRepository(InteractionHeaderHistory);
      }

      let where = this.generateWhere(payload, "submitCwcDate");
      const limit = 10;
      const logInteractionRaw = await repoHistory.find({
        where: where,
        skip: Number(payload.page) * limit,
        take: limit,
      });
      let logInteraction = [];
      if (logInteractionRaw.length > 0) {
        logInteraction = logInteractionRaw.map(function (elem) {
          let output = elem;
          const date1 = new Date(elem.submitCwcDate);
          const date2 = new Date(elem.startDate);
          output.duration = (date1.getTime() - date2.getTime()) / 1000;
          return output;
        });
      }

      return {
        isError: false,
        data: logInteraction,
        statusCode: 200,
      };
    } catch (error) {
      console.error(error);
      return { isError: true, data: error.message, statusCode: 500 };
    }
  }

  async totalHandledByChannel(payload: ParamTotalHandled) {
    try {
      const nowDate = this.libService.convertDate(new Date());
      let table;
      let dateFrom;
      let dateTo;
      let where = "";
      let select = "SELECT channelId,count(1) as total";
      let groupBy = "group by channelId";

      if (nowDate == payload.dateFrom) {
        table = "interaction_header_history_today";
        dateFrom = nowDate;
        dateTo = nowDate;
      } else {
        table = "interaction_header_history";
        dateFrom = payload.dateFrom;
        dateTo = payload.dateTo;
        where = `WHERE submitCwcDate BETWEEN "${dateFrom} 00:00:00" AND "${dateTo} 23:59:59"`;
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
      console.log(queryHistory);
      let resultHistory = await entityManager.query(queryHistory);

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

  async sla(payload: ParamGeneral) {
    try {
      const nowDate = this.libService.convertDate(new Date());

      //GET SLA
      let repoSetting = getRepository(Setting);
      const settingData = await repoSetting.findOne({
        select: ["value"],
        where: {
          type: "sla",
        },
      });

      const SLA = settingData.value;

      let table;
      let dateFrom;
      let dateTo;
      let where = "";
      let select = `SELECT count(1) as total, SUM(CASE WHEN TIME_TO_SEC(TIMEDIFF(pickupDate,submitCwcDate)) < ${SLA} THEN 1 ELSE 0 END) as totalSLA`;
      let groupBy = "";

      if (nowDate == payload.dateFrom) {
        table = "interaction_header_history_today";
        dateFrom = nowDate;
        dateTo = nowDate;
      } else {
        table = "interaction_header_history";
        dateFrom = payload.dateFrom;
        dateTo = payload.dateTo;
        where = `WHERE submitCwcDate BETWEEN "${dateFrom} 00:00:00" AND "${dateTo} 23:59:59"`;
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

      let resultHistory = await entityManager.query(queryHistory);
      let result = {
        inSLA: 0,
        outSLA: 0,
        percentage: 0,
      };
      if (resultHistory.length > 0) {
        const resultSLA = resultHistory[0];
        if (resultSLA.total != 0) {
          let percentage =
            (Number(resultSLA.totalSLA) / Number(resultSLA.total)) * 100;
          percentage = Math.round(percentage);
          result.inSLA = Number(resultSLA.totalSLA);
          result.outSLA = Number(resultSLA.total) - Number(resultSLA.totalSLA);
          result.percentage = percentage;
        }
      }

      return {
        isError: false,
        data: result,
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
        select = "SELECT hour(startDate) as time,count(1) as total,channelId";
        groupBy = "group by hour(startDate),channelId";
        dateFrom = nowDate;
        dateTo = nowDate;
        where = `WHERE startDate BETWEEN "${dateFrom} 00:00:00" AND "${dateTo} 23:59:59"`;
      } else {
        table = "interaction_header_history";
        select = "SELECT date(startDate) as time,count(1) as total,channelId";
        groupBy = "group by date(startDate),channelId";
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
