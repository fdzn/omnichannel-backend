import {
  IsNotEmpty,
  IsEnum,
  isNotEmpty,
  IsInt,
  Min,
  IsOptional
} from "class-validator";

export class GeneralTablePost {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  page: number;

  @IsNotEmpty()
  @IsInt()
  limit: number;

  @IsNotEmpty()
  startDate: Date;

  @IsNotEmpty()
  endDate: Date;

  @IsOptional()
  keyword: string;

  @IsOptional()
  keywords: { key: string; value }[];
}

export class WorkOrder {
  @IsNotEmpty()
  channelId: string;
}