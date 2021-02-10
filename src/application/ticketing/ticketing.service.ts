import { Injectable } from "@nestjs/common";
import { getRepository, getManager } from "typeorm";
import { nanoid } from "nanoid";
//ENTITY
import { Ticket, TicketAction } from "../../entity/ticket.entity";
import { TicketHistory } from "../../entity/ticket_history.entity";
import { mTicketStatus } from "../../entity/m_ticket_status.entity";

@Injectable()
export class TicketingService {
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
