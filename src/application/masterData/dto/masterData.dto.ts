import { IsNotEmpty, IsInt, IsOptional } from "class-validator";

export class GetSubCategoryPost {
  @IsNotEmpty()
  @IsInt()
  categoryId: number;
}

export class GeneralTablePost {
  @IsNotEmpty()
  // @IsInt()
  page: number;

  @IsNotEmpty()
  // @IsInt()
  limit: number;

  // @IsOptional()
  keyword: string;
}

export class GetSubCategoryPostV2 extends GeneralTablePost {
  @IsNotEmpty()
  @IsInt()
  categoryId: number;
}
