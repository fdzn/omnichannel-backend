import { Injectable } from "@nestjs/common";
import { getRepository, getManager } from "typeorm";
import { nanoid } from "nanoid";

//ENTITY
import { Ticket } from "../../entity/ticket.entity";
import { TicketHistory } from "../../entity/ticket_history.entity";

//DTO
import {
  SubmitTicketPost,
  ListTicketPost,
  HistoryTicketGet,
} from "./dto/ticketing.dto";
@Injectable()
export class TicketingService {
  async submitTicket(payload: SubmitTicketPost, user) {
    try {
      const repoTicket = getRepository(Ticket);
      const detailTicket = await repoTicket.findOne({
        id: payload.ticketId,
      });

      if (detailTicket) {
        if (detailTicket.statusId !== payload.statusId) {
          let updateTicket = detailTicket;
          updateTicket.action = payload.action;
          updateTicket.notes = payload.notes;
          updateTicket.priority = payload.priority;
          updateTicket.statusId = payload.statusId;
          updateTicket.subject = payload.subject;
          updateTicket.unitId = payload.unitId;
          updateTicket.updaterUsername = user.username;
          const resultUpdate = await repoTicket.save(updateTicket);

          this.createHistory(resultUpdate);

          return { isError: false, data: resultUpdate, statusCode: 200 };
        }
      } else {
        return { isError: false, data: "ticket id not found", statusCode: 404 };
      }
    } catch (error) {
      console.error(error);
      return { isError: true, data: error.message, statusCode: 500 };
    }
  }

  async createNewTicket(user) {
    let newTicket = new Ticket();
    newTicket.id = this.generateTicketId();
    newTicket.creatorUsername = user.username;
    newTicket.notes = "New Ticket";
    newTicket.unitId = user.unitId;
    newTicket.updater = user.username;

    const repoTicket = getRepository(Ticket);
    const resultSave = await repoTicket.save(newTicket);
    this.createHistory(resultSave);
    return newTicket;
  }

  async createHistory(payload: Ticket) {
    let newHistory = new TicketHistory();
    newHistory.notes = payload.notes;
    newHistory.statusId = payload.statusId;
    newHistory.ticketId = payload.id;
    newHistory.updaterUsername = payload.updaterUsername;
    const repoHistoryTicket = getRepository(TicketHistory);
    return repoHistoryTicket.save(newHistory);
  }

  generateTicketId() {
    const date = new Date();
    var d = date,
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear(),
      seconds = date.getSeconds(),
      minutes = date.getMinutes(),
      hour = date.getHours();
    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return `${[year, month, day, hour, minutes, seconds].join("")}-${nanoid(
      11
    )}`;
  }

  async getListTicketPost(payload: ListTicketPost, user) {
    try {
      const entityManager = getManager();
      let where = "";
      let keywords = payload.keywords || [];
      keywords.forEach((keyword, index) => {
        if (index == 0) {
          where = "WHERE";
        }

        const keywordKey = keyword.key.trim();
        const keywordValue = keyword.value;
        if (keywordKey === "dateFrom") {
          where += ` a.createdAt >= '${keywordValue}'`;
        } else if (keywordKey === "dateTo") {
          where += ` a.createdAt <= '${keywordValue}'`;
        } else if (keywordKey === "custName") {
          where += ` g.name LIKE '%${keywordValue}%'`;
        } else {
          where += ` a.${keywordKey} LIKE '%${keywordValue}%'`;
        }
        console.log("keywords.length-1", keywords.length - 1);
        console.log("index", index);
        if (index < keywords.length - 1) {
          where += " AND";
        }
      });

      console.log("where>>>", where);

      let limit = ` LIMIT ${payload.limit} OFFSET ${
        (payload.page - 1) * payload.limit
      }`;

      let query = `SELECT
                      a.id,
                      a.subject,
                      a.priority,
                      a.action,
                      a.statusId,
                      a.unitId,
                      a.notes,
                      a.creatorUsername,
                      a.updaterUsername,
                      a.createdAt,
                      a.updatedAt,
                      b.name AS ticketStatus,
                      c.categoryId,
                      c.subcategoryId,
                      d.name AS category,
                      e.name AS subcategory,
                      f.customerId,
                      g.name AS custName,
                      g.phone,
                      g.email,
                      g.telegram,
                      g.gender,
                      g.address,
                      g.city,
                      g.company,
                      g.priority,
                      h.name as unit
                    FROM
                      ticket a
                      LEFT JOIN m_ticket_status b ON (a.statusId = b.id)
                      LEFT JOIN cwc c ON (a.id = c.ticketId)
                      LEFT JOIN m_category d ON (c.categoryId = d.id)
                      LEFT JOIN m_sub_category e ON (c.subcategoryId = e.id)
                      LEFT JOIN interaction_header_history f ON (c.sessionId = f.sessionId)
                      LEFT JOIN customer g ON (f.customerId = g.id)
                      LEFT JOIN m_unit h ON (a.unitId = h.id)
                      ${where} ${limit}
      `;
      let queryCount = `SELECT count(0) as totalData
                    FROM
                      ticket a
                      LEFT JOIN m_ticket_status b ON (a.statusId = b.id)
                      LEFT JOIN cwc c ON (a.id = c.ticketId)
                      LEFT JOIN m_category d ON (c.categoryId = d.id)
                      LEFT JOIN m_sub_category e ON (c.subcategoryId = e.id)
                      LEFT JOIN interaction_header_history f ON (c.sessionId = f.sessionId)
                      LEFT JOIN customer g ON (f.customerId = g.id)
                      LEFT JOIN m_unit h ON (a.unitId = h.id)
                      ${where}
      `;

      let result = await entityManager.query(query);
      let totalData = await entityManager.query(queryCount);
      return {
        isError: false,
        data: result.length > 0 ? result : [],
        totalData: parseInt(totalData[0].totalData, 10),
        statusCode: 200,
      };

      // const page = (payload.page - 1) * payload.limit;
      // let keywords = payload.keywords || [];

      // const repoTicket = getRepository(Ticket);
      // let sql = repoTicket
      //   .createQueryBuilder("ticket")
      //   .select([
      //     "ticket.id",
      //     "ticket.subject",
      //     "ticket.priority",
      //     "ticket.action",
      //     "ticket.status",
      //     "ticket.unit",
      //     "ticket.notes",
      //     "ticket.creatorUsername",
      //     "ticket.updaterUsername",
      //     "ticket.createdAt",
      //     "ticket.updatedAt"
      //   ])

      // keywords.forEach((keyword) => {
      //   const keywordKey = keyword.key.trim();
      //   const keywordValue = keyword.value;
      //   if (keywordKey === "dateFrom") {
      //     sql.andWhere(`ticket.createdAt >= :${keywordKey}`, {
      //       [keywordKey]: `${keywordValue}`,
      //     });
      //   } else if (keywordKey === "dateTo") {
      //     sql.andWhere(`ticket.createdAt <= :${keywordKey}`, {
      //       [keywordKey]: `${keywordValue}`,
      //     });
      //   } else {
      //     sql.andWhere(`ticket.${keywordKey} LIKE :${keywordKey}`, {
      //       [keywordKey]: `%${keywordValue}%`,
      //     });
      //   }
      // });

      // const count = await sql.getCount();
      // sql.skip(page);
      // sql.take(payload.limit);

      // const result = await sql.getMany();

      // const output = {
      //   totalData: count,
      //   listData: result,
      // };
      // console.log("output>>>", output);
      // return {
      //   isError: false,
      //   data: output,
      //   statusCode: 200,
      // };
    } catch (error) {
      console.error(error);
      return { isError: true, data: error.message, statusCode: 500 };
    }
  }

  async historyTicket(payload: HistoryTicketGet) {
    try {
      const repoTicket = getRepository(TicketHistory);
      console.log(payload);
      const limit = Number(payload.limit);
      const page = (Number(payload.page) - 1) * limit;

      const resultGet = await repoTicket.find({
        where: {
          ticketId: payload.ticketId,
        },
        skip: page,
        take: limit,
        order: {
          createdAt: "DESC",
        },
      });
      return {
        isError: false,
        data: resultGet,
        statusCode: 200,
      };
    } catch (error) {
      console.error(error);
      return { isError: true, data: error.message, statusCode: 500 };
    }
  }
}
