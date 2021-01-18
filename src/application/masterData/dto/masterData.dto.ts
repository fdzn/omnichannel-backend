import { IsNotEmpty, IsInt, IsOptional, Min, IsString } from "class-validator";

export class GetSubCategoryPost {
  @IsNotEmpty()
  @IsInt()
  categoryId: number;
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

export class AddCategoryPost {
  @IsNotEmpty()
  name: string;
}

export class AddSubCategoryPost extends AddCategoryPost {
  @IsNotEmpty()
  @IsInt()
  categoryId: number;
}

export class EditCategoryPut {
  @IsNotEmpty()
  @IsInt()
  id: number;
  @IsNotEmpty()
  name: string;
}

export class EditSubCategoryPut extends EditCategoryPut {
  @IsNotEmpty()
  @IsInt()
  categoryId: number;
}

export class DeleteGeneralPut {
  @IsNotEmpty()
  @IsInt()
  id: number;
}

export class GetSubCategoryPostV2 extends GeneralTablePost {
  @IsNotEmpty()
  @IsInt()
  categoryId: number;
}

export class GetTemplate {
  @IsNotEmpty()
  @IsString()
  templateType: string;
  limit: number;
}
