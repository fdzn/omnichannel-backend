import {
  IsNotEmpty,
  IsEnum,
  isNotEmpty,
  IsInt,
  Min,
  IsOptional,
} from "class-validator";
import { TicketAction } from "../../../entity/ticket.entity";
export enum DashboardType {
  AGENT = "agent",
  ALL = "all",
}
export class DashboardPost {
  @IsNotEmpty()
  dateFrom: Date;
  @IsNotEmpty()
  dateTo: Date;
  @IsEnum(DashboardType)
  action: DashboardType;
  @IsNotEmpty()
  channelId: number;
}

export class HistoryTicketGet {
  ticketId: string;
  page: number;
  limit: number;
}

export class ListTicketPost {
  page: number;
  limit: number;
  @IsOptional()
  keywords: { key: string; value }[];
}

export class SubmitTicketPost {
  @IsNotEmpty()
  ticketId: string;

  @IsNotEmpty()
  subject: string;

  @IsNotEmpty()
  priority: boolean;

  @IsNotEmpty()
  @IsEnum(TicketAction)
  action: TicketAction;

  @IsNotEmpty()
  statusId: number;

  @IsNotEmpty()
  unitId: number;

  @IsNotEmpty()
  notes: string;
}
