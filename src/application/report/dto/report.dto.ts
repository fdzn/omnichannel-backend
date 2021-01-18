import { IsNotEmpty, IsEnum, isNotEmpty } from "class-validator";
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
