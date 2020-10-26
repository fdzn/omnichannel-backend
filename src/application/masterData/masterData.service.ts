import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

//ENTITY
import { mCategory } from "../../entity/m_category.entity";
import { mSubCategory } from "../../entity/m_sub_category.entity";

//DTO
import { GetSubCategoryPost } from "./dto/masterData.dto";
@Injectable()
export class MasterDataService {
  private channelId: string;
  constructor(
    @InjectRepository(mCategory)
    private readonly mCategoryRepository: Repository<mCategory>,
    @InjectRepository(mSubCategory)
    private readonly mSubCategoryRepository: Repository<mSubCategory>
  ) {}

  async getCategory() {
    try {
      const result = await this.mCategoryRepository.find({
        select: ["id", "name"],
        where: { isDeleted: false, isActive: true },
      });
      return {
        isError: false,
        data: result,
        statusCode: 200,
      };
    } catch (error) {
      console.error(error);
      return { isError: true, data: error.message, statusCode: 500 };
    }
  }

  async getSubCategory(data: GetSubCategoryPost) {
    try {
      const result = await this.mSubCategoryRepository.find({
        select: ["id", "name"],
        where: {
          categoryId: data.categoryId,
          isDeleted: false,
          isActive: true,
        },
      });
      return {
        isError: false,
        data: result,
        statusCode: 201,
      };
    } catch (error) {
      console.error(error);
      return { isError: true, data: error.message, statusCode: 500 };
    }
  }
}
