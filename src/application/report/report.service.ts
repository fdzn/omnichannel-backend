import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, getManager } from "typeorm";

//ENTITY
import { InteractionHeaderHistory } from "../../entity/interaction_header_history.entity";
import { AgentLog } from "../../entity/agent_log.entity";

//MODULE
import { LibsService } from "../libs/services/lib.service";

import { GeneralTablePost } from "./dto/report.dto";

@Injectable()
export class ReportService {
  constructor(
    private readonly libsService: LibsService,
    @InjectRepository(AgentLog)
    private readonly agentLogRepository: Repository<AgentLog>
  ) {}

  async getDashboardSummaryAgent(payload) {
    try {
      const todayDate = new Date();
      const yesterdayDate = new Date(todayDate);
      yesterdayDate.setDate(yesterdayDate.getDate() - 1);

      const today = this.libsService.convertDate(todayDate);
      const yesterday = this.libsService.convertDate(yesterdayDate);
      const month = todayDate.getMonth();
      const year = todayDate.getFullYear();
      const firstDay = this.libsService.convertDate(new Date(year, month, 1));
      const lastDay = this.libsService.convertDate(
        new Date(year, month + 1, 0)
      );
      const query = `SELECT
                IFNULL(SEC_TO_TIME(ROUND(AVG(TIMESTAMPDIFF(SECOND,startDate,frDate)),0)),"00:00:00") as avgResponseTime,
                IFNULL(SEC_TO_TIME(ROUND(AVG(TIMESTAMPDIFF(SECOND,frDate,submitCwcDate)),0)),"00:00:00") as avgInteractionTime,
                COUNT(1) as callOffered
            FROM
                interaction_header_history
            WHERE
                agentUsername = "${payload.username}"`;

      const queryNextToday = `AND submitCwcDate BETWEEN "${today} 00:00:00" AND "${today} 23:59:59";`;
      const queryNextYesterday = `AND submitCwcDate BETWEEN "${yesterday} 00:00:00" AND "${yesterday} 23:59:59";`;
      const queryNextThisMonth = `AND submitCwcDate BETWEEN "${firstDay} 00:00:00" AND "${lastDay} 23:59:59"`;
      const entityManager = getManager();

      let result = [];
      let resultToday = await entityManager.query(`${query} ${queryNextToday}`);
      resultToday[0]["type"] = "today";
      result.push(resultToday[0]);
      let resultYesterday = await entityManager.query(
        `${query} ${queryNextYesterday}`
      );
      resultYesterday[0]["type"] = "yesterday";
      result.push(resultYesterday[0]);
      let resultThisMonth = await entityManager.query(
        `${query} ${queryNextThisMonth}`
      );
      resultThisMonth[0]["type"] = "this_month";
      result.push(resultThisMonth[0]);
      return {
        isError: false,
        data: result,
        statusCode: 200
      };
    } catch (error) {
      console.error(error);
      return { isError: true, data: error.message, statusCode: 500 };
    }
  }

  async getAgentLog(payload: GeneralTablePost) {
    try {
      const page = (payload.page - 1) * payload.limit;
      let keywords = payload.keywords || [];

      let sql = this.agentLogRepository
        .createQueryBuilder("agentLog")
        .select([
          "agentLog.id",
          "agentLog.username",
          "agentLog.reason",
          "agentLog.logoutReason",
          "agentLog.info",
          "agentLog.timeStart",
          "agentLog.timeEnd",
          "agentLog.createdAt",
          "agentLog.updatedAt",
          "agentLog.updater"
        ]);

      keywords.forEach((keyword) => {
        const keywordKey = keyword.key.trim();
        const keywordValue = keyword.value;
        sql.andWhere(`agentLog.${keywordKey} LIKE :${keywordKey}`, {
          [keywordKey]: `%${keywordValue}%`
        });
      });
      const count = await sql.getCount();
      sql.skip(page);
      sql.take(payload.limit);

      const result = await sql.getMany();

      const output = {
        totalData: count,
        listData: result
      };
      return {
        isError: false,
        data: output,
        statusCode: 200
      };
    } catch (error) {
      console.error(error);
      return { isError: true, data: error.message, statusCode: 500 };
    }
  }
}
