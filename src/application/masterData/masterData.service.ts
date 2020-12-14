import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Brackets } from "typeorm";

//ENTITY
import { mCategory } from "../../entity/m_category.entity";
import { mSubCategory } from "../../entity/m_sub_category.entity";
import { User } from "../../entity/user.entity";

//DTO
import { GetSubCategoryPost, GeneralTablePost } from "./dto/masterData.dto";
@Injectable()
export class MasterDataService {
  constructor(
    @InjectRepository(mCategory)
    private readonly mCategoryRepository: Repository<mCategory>,
    @InjectRepository(mSubCategory)
    private readonly mSubCategoryRepository: Repository<mSubCategory>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async getCategoryPost(payload: GeneralTablePost) {
    try {
      const page = payload.page - 1;
      let keyword = "";
      if (payload.keyword) {
        if (payload.keyword.trim() !== "") {
          keyword = payload.keyword;
        }
      }

      let sql = this.mCategoryRepository
        .createQueryBuilder("category")
        .select([
          "category.id",
          "category.name",
          "category.updaterUsername",
          "category.updatedAt",
        ])
        .where("category.isActive = true")
        .andWhere("category.isDeleted = false");

      if (keyword !== "") {
        sql.andWhere(
          new Brackets((qb) => {
            qb.where("category.name LIKE :keyword", {
              keyword: `%${keyword}%`,
            });
          })
        );
      }
      const count = await sql.getCount();
      sql.skip(page);
      sql.limit(payload.limit);

      const result = await sql.getMany();

      const output = {
        totalData: count,
        listData: result,
      };
      return {
        isError: false,
        data: output,
        statusCode: 200,
      };
    } catch (error) {
      console.error(error);
      return { isError: true, data: error.message, statusCode: 500 };
    }
  }

  async getSubCategoryPost(payload: GeneralTablePost) {
    try {
      const page = payload.page - 1;
      let keyword = "";
      if (payload.keyword) {
        if (payload.keyword.trim() !== "") {
          keyword = payload.keyword;
        }
      }

      let sql = this.mSubCategoryRepository
        .createQueryBuilder("subCategory")
        .select([
          "category.id",
          "category.name",
          "subCategory.id",
          "subCategory.name",
          "subCategory.updaterUsername",
          "subCategory.updatedAt",
        ])
        .leftJoin("subCategory.category", "category")
        .where("subCategory.isActive = true")
        .andWhere("category.isActive = true")
        .andWhere("subCategory.isDeleted = false")
        .andWhere("category.isDeleted = false");

      if (keyword !== "") {
        sql.andWhere(
          new Brackets((qb) => {
            qb.where("subCategory.name LIKE :keyword", {
              keyword: `%${keyword}%`,
            }).orWhere("category.name LIKE :keyword", {
              keyword: `%${keyword}%`,
            });
          })
        );
      }
      const count = await sql.getCount();
      sql.skip(page);
      sql.limit(payload.limit);

      const result = await sql.getMany();

      const output = {
        totalData: count,
        listData: result,
      };
      return {
        isError: false,
        data: output,
        statusCode: 200,
      };
    } catch (error) {
      console.error(error);
      return { isError: true, data: error.message, statusCode: 500 };
    }
  }

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

  async getUser() {
    try {
      const result = await this.userRepository.find({
        select: [
          "username",
          "name",
          "level",
          "avatar",
          "phone",
          "email",
          "unit",
          "group",
          "isLogin",
        ],
        where: {
          isDeleted: false,
          isActive: true,
        },
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

  async addCategory(data, user) {
    try {
      let newCategory = new mCategory();
      newCategory.name = data.category;
      newCategory.updaterUsername = user.username;
      const result = await this.mCategoryRepository.save(newCategory);
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

  async editCategory(data, user) {
    try {
      let newCategory = new mCategory();
      newCategory.name = data.category;
      newCategory.updaterUsername = user.username;
      const result = await this.mCategoryRepository.update(
        {
          id: data.categoryId,
        },
        newCategory
      );
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

  async deleteCategory(data, user) {
    try {
      let newCategory = new mCategory();
      newCategory.isDeleted = true;
      newCategory.updaterUsername = user.username;
      const result = await this.mCategoryRepository.update(
        {
          id: data.categoryId,
        },
        newCategory
      );
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

  async addSubCategory(data, user) {
    try {
      let newSubCategory = new mSubCategory();
      newSubCategory.categoryId = data.categoryId;
      newSubCategory.name = data.subCategory;
      newSubCategory.updaterUsername = user.username;
      const result = await this.mSubCategoryRepository.save(newSubCategory);
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

  async editSubCategory(data, user) {
    try {
      let newSubCategory = new mSubCategory();
      newSubCategory.categoryId = data.categoryId;
      newSubCategory.name = data.subCategory;
      newSubCategory.updaterUsername = user.username;
      const result = await this.mSubCategoryRepository.update(
        {
          id: data.subCategoryId,
        },
        newSubCategory
      );
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

  async deleteSubCategory(data, user) {
    try {
      let newSubCategory = new mSubCategory();
      newSubCategory.isDeleted = true;
      newSubCategory.updaterUsername = user.username;
      const result = await this.mCategoryRepository.update(
        {
          id: data.subCategoryId,
        },
        newSubCategory
      );
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
}
