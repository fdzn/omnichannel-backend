import {
  IsNotEmpty,
  IsEnum,
  isNotEmpty,
  IsInt,
  Min,
  IsOptional,
} from "class-validator";
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

export class ListTicketGet {
  page: number;
  limit: number;
  ticketStatus: number;
  dateFrom: Date;
  dateTo: Date;
}
