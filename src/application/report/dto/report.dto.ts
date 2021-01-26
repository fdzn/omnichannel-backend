import { IsNotEmpty, IsEnum, isNotEmpty, IsInt, Min, IsOptional } from "class-validator";
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

export class GeneralTablePost {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  page: number;

  @IsNotEmpty()
  @IsInt()
  limit: number;

  @IsOptional()
  keyword: string;

  @IsOptional()
  keywords: { key: string; value }[];
}