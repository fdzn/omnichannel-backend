import { IsNotEmpty, IsInt, IsOptional, Min, IsString, IsBoolean } from "class-validator";

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

export class AddTemplatePost {
  @IsNotEmpty()
  message: string;
  @IsNotEmpty()
  @IsInt()
  order: number;
  @IsNotEmpty()
  template_type: string;
  @IsNotEmpty()
  @IsBoolean()
  isActive: boolean;
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

export class EdiTemplatePut {
  @IsNotEmpty()
  @IsInt()
  id: number;
  @IsOptional()
  @IsNotEmpty()
  message: string;
  @IsOptional()
  @IsNotEmpty()
  @IsInt()
  order: number;
  @IsOptional()
  @IsNotEmpty()
  template_type: string;
  @IsOptional()
  @IsNotEmpty()
  @IsBoolean()
  isActive: boolean;
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
