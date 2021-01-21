import {
  IsNotEmpty,
  IsInt,
  IsOptional,
  Min,
  IsString,
  IsBoolean,
  IsEmail,
  IsIn,
} from "class-validator";

import { UserLevel } from "../../../entity/user.entity";

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

export class AddUserPost {
  @IsNotEmpty()
  username: string;
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  password: string;
  @IsNotEmpty()
  level: UserLevel;
  @IsOptional()
  @IsNotEmpty()
  phone: string;
  @IsOptional()
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsOptional()
  @IsNotEmpty()
  @IsInt()
  unitId: number;
  @IsOptional()
  @IsNotEmpty()
  @IsInt()
  groupId: number;
}
export class AddWorkOrderPost {
  @IsNotEmpty()
  agentUsername: string;
  @IsNotEmpty()
  channelId: string;
  @IsNotEmpty()
  @IsInt()
  limit: number;
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

export class EditWorkOrderPut {
  @IsNotEmpty()
  @IsInt()
  id: number;
  @IsOptional()
  @IsNotEmpty()
  channelId: string;
  @IsOptional()
  @IsNotEmpty()
  @IsInt()
  limit: number;
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

export class EditTemplatePut {
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

export class EditUserPut extends AddUserPost {
  @IsNotEmpty()
  username: string;
  @IsOptional()
  @IsNotEmpty()
  newUsername: string;
  @IsOptional()
  @IsNotEmpty()
  name: string;
  @IsOptional()
  @IsNotEmpty()
  password: string;
  @IsOptional()
  @IsNotEmpty()
  level: UserLevel;
  @IsOptional()
  @IsNotEmpty()
  hostPbx: string;
  @IsOptional()
  @IsNotEmpty()
  loginPBX: string;
  @IsOptional()
  @IsNotEmpty()
  @IsBoolean()
  isLogin: boolean;
  @IsOptional()
  @IsNotEmpty()
  passwordPBX: string;
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

export class DeleteUser {
  @IsNotEmpty()
  username: string;
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
