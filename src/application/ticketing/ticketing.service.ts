import { Injectable } from "@nestjs/common";
import { getRepository } from "typeorm";
import { nanoid } from "nanoid";

//ENTITY
import { Ticket } from "../../entity/ticket.entity";
import { TicketHistory } from "../../entity/ticket_history.entity";

//DTO
import { SubmitTicketPost } from "./dto/ticketing.dto";
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
    await repoTicket.save(newTicket);
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
}
