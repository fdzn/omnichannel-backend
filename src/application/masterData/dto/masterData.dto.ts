import { IsNotEmpty, IsInt } from "class-validator";

export class GetSubCategoryPost {
  @IsNotEmpty()
  @IsInt()
  categoryId: number;
}
