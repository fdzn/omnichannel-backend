import { Injectable } from "@nestjs/common";
import { getManager } from "typeorm";

//MODULE
import { LibsService } from "../libs/services/lib.service";

// DTO
import { WorkOrder } from "./dto/monitoring.dto";

@Injectable()
export class MonitoringService {
  constructor(private readonly libsService: LibsService) {}

  async getAgentOnline() {
    try {
      const entityManager = getManager();
      const query = `SELECT
                      \`name\`,
                      username,
                      isLogin,
                      IF(isLogin = 1, 'Online', 'Offline') as loginStatus,
                      isAux,
                      IF(isAux = 1, 'AUX', 'Ready') as auxStatus
                    FROM
                      \`user\`
                    WHERE
                      isActive = 1
                    ORDER BY loginStatus, isAux, \`name\``;
      const result = await entityManager.query(`${query}`);
      const output = {
        listData: result,
      };
      console.log(result);
      return {
        isError: false,
        data: output,
        statusCode: 200,
      };
    } catch (error) {
      console.error(error);
      return { isError: true, data: error.message, statusCode: 500 };
    }
  }

  async getWorkOrder(payload: WorkOrder) {
    try {
      const entityManager = getManager();
      const query = `SELECT
                      agentUsername,
                      channelId,
                      \`limit\`,
                      slot,
                      \`limit\` - slot as bucket,
                      lastDist
                    FROM
                      work_order
                    WHERE channelId = '${payload.channelId}' AND \`limit\` != 0
                    ORDER BY
                      bucket DESC,
                      agentUsername,
                      channelId;`;
      const result = await entityManager.query(`${query}`);
      const output = {
        listData: result,
      };
      console.log(result);
      return {
        isError: false,
        data: output,
        statusCode: 200,
      };
    } catch (error) {
      console.error(error);
      return { isError: true, data: error.message, statusCode: 500 };
    }
  }

  async getAgentSession() {
    try {
      const entityManager = getManager();
      const query = `SELECT
                      sessionId,
                      agentUsername,
                      channelId,
                      startDate,
                      pickupDate,
                      frDate,
                      fromName
                    FROM
                      interaction_header
                    WHERE
                      agentUsername IS NOT NULL;`;
      const result = await entityManager.query(`${query}`);
      const output = {
        listData: result,
      };
      console.log(result);
      return {
        isError: false,
        data: output,
        statusCode: 200,
      };
    } catch (error) {
      console.error(error);
      return { isError: true, data: error.message, statusCode: 500 };
    }
  }

  // async getDashboardSummaryAgent(payload) {
  //   try {
  //     const todayDate = new Date();
  //     const yesterdayDate = new Date(todayDate);
  //     yesterdayDate.setDate(yesterdayDate.getDate() - 1);

  //     const today = this.libsService.convertDate(todayDate);
  //     const yesterday = this.libsService.convertDate(yesterdayDate);
  //     const month = todayDate.getMonth();
  //     const year = todayDate.getFullYear();
  //     const firstDay = this.libsService.convertDate(new Date(year, month, 1));
  //     const lastDay = this.libsService.convertDate(
  //       new Date(year, month + 1, 0)
  //     );
  //     const query = `SELECT
  //               IFNULL(SEC_TO_TIME(ROUND(AVG(TIMESTAMPDIFF(SECOND,startDate,frDate)),0)),"00:00:00") as avgResponseTime,
  //               IFNULL(SEC_TO_TIME(ROUND(AVG(TIMESTAMPDIFF(SECOND,frDate,submitCwcDate)),0)),"00:00:00") as avgInteractionTime,
  //               COUNT(1) as callOffered
  //           FROM
  //               interaction_header_history
  //           WHERE
  //               agentUsername = "${payload.username}"`;

  //     const queryNextToday = `AND submitCwcDate BETWEEN "${today} 00:00:00" AND "${today} 23:59:59";`;
  //     const queryNextYesterday = `AND submitCwcDate BETWEEN "${yesterday} 00:00:00" AND "${yesterday} 23:59:59";`;
  //     const queryNextThisMonth = `AND submitCwcDate BETWEEN "${firstDay} 00:00:00" AND "${lastDay} 23:59:59"`;
  //     const entityManager = getManager();

  //     let result = [];
  //     let resultToday = await entityManager.query(`${query} ${queryNextToday}`);
  //     resultToday[0]["type"] = "today";
  //     result.push(resultToday[0]);
  //     let resultYesterday = await entityManager.query(
  //       `${query} ${queryNextYesterday}`
  //     );
  //     resultYesterday[0]["type"] = "yesterday";
  //     result.push(resultYesterday[0]);
  //     let resultThisMonth = await entityManager.query(
  //       `${query} ${queryNextThisMonth}`
  //     );
  //     resultThisMonth[0]["type"] = "this_month";
  //     result.push(resultThisMonth[0]);
  //     return {
  //       isError: false,
  //       data: result,
  //       statusCode: 200
  //     };
  //   } catch (error) {
  //     console.error(error);
  //     return { isError: true, data: error.message, statusCode: 500 };
  //   }
  // }

  // async getAgentLog(payload: GeneralTablePost) {
  //   try {
  //     const page = (payload.page - 1) * payload.limit;
  //     let keywords = payload.keywords || [];

  //     let sql = this.agentLogRepository
  //       .createQueryBuilder("agentLog")
  //       .select([
  //         "agentLog.id",
  //         "agentLog.username",
  //         "agentLog.reason",
  //         "agentLog.logoutReason",
  //         "agentLog.info",
  //         "agentLog.timeStart",
  //         "agentLog.timeEnd",
  //         "agentLog.createdAt",
  //         "agentLog.updatedAt",
  //         "agentLog.updater"
  //       ]);

  //     keywords.forEach((keyword) => {
  //       const keywordKey = keyword.key.trim();
  //       const keywordValue = keyword.value;
  //       sql.andWhere(`agentLog.${keywordKey} LIKE :${keywordKey}`, {
  //         [keywordKey]: `%${keywordValue}%`
  //       });
  //     });

  //     sql.andWhere(`agentLog.timeStart BETWEEN :startDate AND :endDate`, {
  //       startDate: payload.startDate,
  //       endDate: payload.endDate
  //     });

  //     const count = await sql.getCount();
  //     sql.skip(page);
  //     sql.take(payload.limit);

  //     const result = await sql.getMany();

  //     const output = {
  //       totalData: count,
  //       listData: result
  //     };
  //     return {
  //       isError: false,
  //       data: output,
  //       statusCode: 200
  //     };
  //   } catch (error) {
  //     console.error(error);
  //     return { isError: true, data: error.message, statusCode: 500 };
  //   }
  // }

  // async getInteraction(payload: GeneralTablePost) {
  //   try {
  //     const entityManager = getManager();
  //     const page = (payload.page - 1) * payload.limit;
  //     let keywords = payload.keywords || [];

  //     const query = `SELECT
  //                         a.agentUsername AS "Agent ID",
  //                         e.name AS "Agent Name",
  //                         b.name AS "Channel",
  //                         a.sessionId,
  //                         \`from\`,
  //                         fromName AS "From Name",
  //                         customerId AS "Cust ID",
  //                         cc.name AS "Customer Name",
  //                         cc.phone AS "Msisdn",
  //                         startDate AS "Date",
  //                         c.categoryId AS "Category ID",
  //                         f.name AS "Category",
  //                         c.subcategoryId AS "Sub Category ID",
  //                         d.name AS "Sub Category",
  //                         remark AS "Remark",
  //                         feedback AS "Feedback",
  //                         sentiment AS "Sentiment",
  //                         caseIn AS "Case In",
  //                         caseOut AS "Case Out",
  //                         CASE WHEN pickupDate != '0000-00-00 00:00:00' THEN
  //                           TIME_TO_SEC(TIMEDIFF(pickupDate, startDate))
  //                         ELSE
  //                           0
  //                         END AS 'waiting time',
  //                         CASE WHEN frDate != '0000-00-00 00:00:00' THEN
  //                           TIME_TO_SEC(TIMEDIFF(frDate, pickupDate))
  //                         ELSE
  //                           0
  //                         END AS 'response time',
  //                         CASE WHEN submitCwcDate != '0000-00-00 00:00:00' THEN
  //                           TIME_TO_SEC(TIMEDIFF(submitCwcDate, pickupDate))
  //                         ELSE
  //                           0
  //                         END AS 'handling time',
  //                         CASE WHEN submitCwcDate != '0000-00-00 00:00:00' THEN
  //                           TIME_TO_SEC(TIMEDIFF(submitCwcDate, pickupDate))
  //                         ELSE
  //                           0
  //                         END AS 'service time',
  //                         CASE WHEN submitCwcDate != '0000-00-00 00:00:00' THEN
  //                           TIME_TO_SEC(TIMEDIFF(submitCwcDate, submitCwcDate))
  //                         ELSE
  //                           0
  //                         END AS 'ACW',
  //                         CASE WHEN submitCwcDate != '0000-00-00 00:00:00' THEN
  //                           TIME_TO_SEC(TIMEDIFF(submitCwcDate, startDate))
  //                         ELSE
  //                           0
  //                         END AS duration
  //                       FROM
  //                         interaction_header_history a
  //                         INNER JOIN customer cc ON customerId = cc.id
  //                         INNER JOIN m_channel b ON a.channelId = b.id
  //                         INNER JOIN cwc c ON a.sessionId = c.sessionId
  //                         INNER JOIN m_sub_category d ON c.subcategoryId = d.id
  //                         INNER JOIN \`user\` e ON a.agentUsername = e.username
  //                         INNER JOIN m_category f ON c.categoryId = f.id
  //                         WHERE startDate BETWEEN '${payload.startDate}' AND '${payload.endDate}'
  //                       GROUP BY
  //                         c.id;`;
  //     const result = await entityManager.query(`${query}`);
  //     const output = {
  //       // totalData: count,
  //       listData: result
  //     };
  //     return {
  //       isError: false,
  //       data: output,
  //       statusCode: 200
  //     };
  //   } catch (error) {
  //     console.error(error);
  //     return { isError: true, data: error.message, statusCode: 500 };
  //   }
  // }

  // async getInteractionDetail(payload) {
  //   try {
  //     const entityManager = getManager();
  //     const page = (payload.page - 1) * payload.limit;
  //     let keywords = payload.keywords || [];

  //     let tableInteraction;

  //     switch (payload.channelId) {
  //       case "webchat":
  //         tableInteraction = "interaction_webchat";
  //         break;
  //       case "whatsapp":
  //         tableInteraction = "interaction_whatsapp";
  //         break;
  //       default:
  //         tableInteraction = "interaction_webchat";
  //         break;
  //     }

  //     const query = `SELECT
  //                     sessionId,
  //                     \`from\`,
  //                     fromName,
  //                     message,
  //                     media,
  //                     sendDate,
  //                     actionType,
  //                     agentUsername
  //                   FROM
  //                     ${tableInteraction}
  //                     WHERE createdAt BETWEEN '${payload.startDate}' AND '${payload.endDate}';`;
  //     const result = await entityManager.query(`${query}`);
  //     const output = {
  //       // totalData: count,
  //       listData: result
  //     };
  //     return {
  //       isError: false,
  //       data: output,
  //       statusCode: 200
  //     };
  //   } catch (error) {
  //     console.error(error);
  //     return { isError: true, data: error.message, statusCode: 500 };
  //   }
  // }

  // async getPerformanceAgent(payload: GeneralTablePost) {
  //   try {
  //     const entityManager = getManager();
  //     const page = (payload.page - 1) * payload.limit;
  //     let keywords = payload.keywords || [];

  //     const query = `SELECT
  //                   agentUsername,
  //                   channelId,
  //                   count(caseIn) AS 'Case IN',
  //                   count(caseOut) AS 'Case Out',
  //                   sum(
  //                     CASE WHEN pickupDate != '0000-00-00 00:00:00' THEN
  //                       TIME_TO_SEC(TIMEDIFF(pickupDate, startDate))
  //                     ELSE
  //                       0
  //                     END) AS 'waiting time',
  //                   sum(
  //                     CASE WHEN frDate != '0000-00-00 00:00:00' THEN
  //                       TIME_TO_SEC(TIMEDIFF(frDate, pickupDate))
  //                     ELSE
  //                       0
  //                     END) AS 'response time',
  //                   sum(
  //                     CASE WHEN submitCwcDate != '0000-00-00 00:00:00' THEN
  //                       TIME_TO_SEC(TIMEDIFF(submitCwcDate, pickupDate))
  //                     ELSE
  //                       0
  //                     END) AS 'handling time',
  //                   sum(
  //                     CASE WHEN submitCwcDate != '0000-00-00 00:00:00' THEN
  //                       TIME_TO_SEC(TIMEDIFF(submitCwcDate, pickupDate))
  //                     ELSE
  //                       0
  //                     END) AS 'service time',
  //                   sum(
  //                     CASE WHEN submitCwcDate != '0000-00-00 00:00:00' THEN
  //                       TIME_TO_SEC(TIMEDIFF(submitCwcDate, submitCwcDate))
  //                     ELSE
  //                       0
  //                     END) AS 'ACW',
  //                   sum(
  //                     CASE WHEN submitCwcDate != '0000-00-00 00:00:00' THEN
  //                       TIME_TO_SEC(TIMEDIFF(submitCwcDate, startDate))
  //                     ELSE
  //                       0
  //                     END) AS duration
  //                 FROM
  //                   interaction_header_history
  //                 WHERE createdAt BETWEEN '${payload.startDate}' AND '${payload.endDate}'
  //                 GROUP BY
  //                   agentUsername,
  //                   channelId;
  //     `;
  //     const result = await entityManager.query(`${query}`);
  //     const output = {
  //       // totalData: count,
  //       listData: result
  //     };
  //     return {
  //       isError: false,
  //       data: output,
  //       statusCode: 200
  //     };
  //   } catch (error) {
  //     console.error(error);
  //     return { isError: true, data: error.message, statusCode: 500 };
  //   }
  // }

  // async getReportTraffic(payload: GeneralTablePost) {
  //   try {
  //     const entityManager = getManager();
  //     const page = (payload.page - 1) * payload.limit;
  //     let keywords = payload.keywords || [];

  //     const query = `SELECT
  //                       channelId,
  //                       sum(jml) as jml
  //                     FROM (
  //                       SELECT
  //                         channelId,
  //                         count(1) AS jml
  //                       FROM
  //                         interaction_header
  //                       WHERE createdAt BETWEEN '${payload.startDate}' AND '${payload.endDate}'
  //                       GROUP BY
  //                         channelId
  //                       UNION ALL
  //                       SELECT
  //                         channelId,
  //                         count(1) AS jml
  //                       FROM
  //                         interaction_header_history
  //                       WHERE createdAt BETWEEN '${payload.startDate}' AND '${payload.endDate}'
  //                       GROUP BY
  //                         channelId) v
  //                     GROUP BY
  //                       channelId;
  //     `;
  //     const result = await entityManager.query(`${query}`);
  //     const output = {
  //       // totalData: count,
  //       listData: result
  //     };
  //     return {
  //       isError: false,
  //       data: output,
  //       statusCode: 200
  //     };
  //   } catch (error) {
  //     console.error(error);
  //     return { isError: true, data: error.message, statusCode: 500 };
  //   }
  // }
}
