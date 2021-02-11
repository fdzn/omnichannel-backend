import { Injectable } from "@nestjs/common";
import { getRepository } from "typeorm";
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
      const page = (payload.page - 1) * payload.limit;
      let keywords = payload.keywords || [];

      const repoTicket = getRepository(Ticket);
      let sql = repoTicket
        .createQueryBuilder("ticket")
        .select([
          "ticket.id",
          "ticket.subject",
          "ticket.priority",
          "ticket.action",
          "ticket.status",
         " m_ticket_status.name",
          "ticket.unit",
          "ticket.notes",
          "ticket.creatorUsername",
          "ticket.updaterUsername",
          "ticket.createdAt",
          "ticket.updatedAt"
        ])
        .leftJoin("ticket.status", "m_ticket_status");

      keywords.forEach((keyword) => {
        const keywordKey = keyword.key.trim();
        const keywordValue = keyword.value;
        if (keywordKey === "dateFrom") {
          sql.andWhere(`ticket.createdAt >= :${keywordKey}`, {
            [keywordKey]: `${keywordValue}`,
          });
        } else if (keywordKey === "dateTo") {
          sql.andWhere(`ticket.createdAt <= :${keywordKey}`, {
            [keywordKey]: `${keywordValue}`,
          });
        } else {
          sql.andWhere(`ticket.${keywordKey} LIKE :${keywordKey}`, {
            [keywordKey]: `%${keywordValue}%`,
          });
        }
      });

      const count = await sql.getCount();
      sql.skip(page);
      sql.take(payload.limit);

      const result = await sql.getMany();

      const output = {
        totalData: count,
        listData: result,
      };
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

  async historyTicket(payload: HistoryTicketGet) {
    try {
      const repoTicket = getRepository(TicketHistory);

      const resultGet = repoTicket.find({
        where: {
          ticketId: payload.ticketId,
        },
        skip: payload.page * payload.limit,
        take: payload.limit,
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
