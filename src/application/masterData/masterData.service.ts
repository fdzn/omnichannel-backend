import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Brackets } from "typeorm";

//ENTITY
import { mCategory } from "../../entity/m_category.entity";
import { mSubCategory } from "../../entity/m_sub_category.entity";
import { mTemplate } from "../../entity/m_template.entity";
import { User } from "../../entity/user.entity";

//DTO
import {
  GetSubCategoryPost,
  GeneralTablePost,
  AddCategoryPost,
  AddTemplatePost,
  EditCategoryPut,
  AddSubCategoryPost,
  EditSubCategoryPut,
  DeleteGeneralPut,
  GetTemplate,
  EdiTemplatePut
} from "./dto/masterData.dto";

@Injectable()
export class MasterDataService {
  constructor(
    @InjectRepository(mCategory)
    private readonly mCategoryRepository: Repository<mCategory>,
    @InjectRepository(mSubCategory)
    private readonly mSubCategoryRepository: Repository<mSubCategory>,
    @InjectRepository(mTemplate)
    private readonly mTemplateRepository: Repository<mTemplate>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async getCategoryPost(payload: GeneralTablePost) {
    try {
      const page = (payload.page - 1) * payload.limit;
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
          "category.updatedAt"
        ])
        .where("category.isActive = true")
        .andWhere("category.isDeleted = false");

      if (keyword !== "") {
        sql.andWhere(
          new Brackets((qb) => {
            qb.where("category.name LIKE :keyword", {
              keyword: `%${keyword}%`
            });
          })
        );
      }
      const count = await sql.getCount();
      sql.skip(page);
      sql.take(payload.limit);

      const result = await sql.getMany();

      const output = {
        totalData: count,
        listData: result
      };
      return {
        isError: false,
        data: output,
        statusCode: 200
      };
    } catch (error) {
      console.error(error);
      return { isError: true, data: error.message, statusCode: 500 };
    }
  }

  async getSubCategoryPost(payload: GeneralTablePost) {
    try {
      const page = (payload.page - 1) * payload.limit;
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
          "subCategory.updatedAt"
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
              keyword: `%${keyword}%`
            }).orWhere("category.name LIKE :keyword", {
              keyword: `%${keyword}%`
            });
          })
        );
      }
      const count = await sql.getCount();
      sql.skip(page);
      sql.take(payload.limit);

      const result = await sql.getMany();
      const output = {
        totalData: count,
        listData: result
      };
      return {
        isError: false,
        data: output,
        statusCode: 200
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
        where: { isDeleted: false, isActive: true }
      });
      return {
        isError: false,
        data: result,
        statusCode: 200
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
          isActive: true
        }
      });
      return {
        isError: false,
        data: result,
        statusCode: 201
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
          "isLogin"
        ],
        where: {
          isDeleted: false,
          isActive: true
        }
      });

      return {
        isError: false,
        data: result,
        statusCode: 200
      };
    } catch (error) {
      console.error(error);
      return { isError: true, data: error.message, statusCode: 500 };
    }
  }

  async getUserPost(payload: GeneralTablePost) {
    try {
      const page = (payload.page - 1) * payload.limit;
      let keywords = payload.keywords || [];

      let sql = this.userRepository
        .createQueryBuilder("user")
        .select([
          "user.username",
          "user.password",
          "user.level",
          "user.name",
          "user.phone",
          "user.email",
          "user.hostPBX",
          "user.loginPBX",
          "user.passwordPBX",
          "user.unitId",
          "user.groupId",
          "user.isLogin",
          "user.isActive",
          "user.isDeleted",
          "user.updater",
          "user.createdAt",
          "user.updatedAt"
        ]);

      keywords.forEach((keyword) => {
        const keywordKey = keyword.key.trim();
        const keywordValue = keyword.value;
        // console.log(`user.${keywordKey} LIKE ${keywordValue}`);
        sql.andWhere(`user.${keywordKey} LIKE :${keywordKey}`, {
          [keywordKey]: `%${keywordValue}%`
        });
      });

      const count = await sql.getCount();
      sql.skip(page);
      sql.take(payload.limit);

      const result = await sql.getMany();

      const output = {
        totalData: count,
        listData: result
      };
      return {
        isError: false,
        data: output,
        statusCode: 200
      };
    } catch (error) {
      console.error(error);
      return { isError: true, data: error.message, statusCode: 500 };
    }
  }

  async addCategory(data: AddCategoryPost, user) {
    try {
      let newCategory = new mCategory();
      newCategory.name = data.name;
      newCategory.updaterUsername = user.username;
      const result = await this.mCategoryRepository.save(newCategory);
      return {
        isError: false,
        data: result,
        statusCode: 200
      };
    } catch (error) {
      console.error(error);
      return { isError: true, data: error.message, statusCode: 500 };
    }
  }

  async editCategory(data: EditCategoryPut, user) {
    try {
      let newCategory = new mCategory();
      newCategory.name = data.name;
      newCategory.updaterUsername = user.username;
      const result = await this.mCategoryRepository.update(
        {
          id: data.id
        },
        newCategory
      );
      return {
        isError: false,
        data: result,
        statusCode: 200
      };
    } catch (error) {
      console.error(error);
      return { isError: true, data: error.message, statusCode: 500 };
    }
  }

  async deleteCategory(data: DeleteGeneralPut, user) {
    try {
      let newCategory = new mCategory();
      newCategory.isDeleted = true;
      newCategory.updaterUsername = user.username;
      const result = await this.mCategoryRepository.update(
        {
          id: data.id
        },
        newCategory
      );
      return {
        isError: false,
        data: result,
        statusCode: 200
      };
    } catch (error) {
      console.error(error);
      return { isError: true, data: error.message, statusCode: 500 };
    }
  }

  async addSubCategory(data: AddSubCategoryPost, user) {
    try {
      let newSubCategory = new mSubCategory();
      newSubCategory.categoryId = data.categoryId;
      newSubCategory.name = data.name;
      newSubCategory.updaterUsername = user.username;
      const result = await this.mSubCategoryRepository.save(newSubCategory);
      return {
        isError: false,
        data: result,
        statusCode: 200
      };
    } catch (error) {
      console.error(error);
      return { isError: true, data: error.message, statusCode: 500 };
    }
  }

  async editSubCategory(data: EditSubCategoryPut, user) {
    try {
      let newSubCategory = new mSubCategory();
      newSubCategory.categoryId = data.categoryId;
      newSubCategory.name = data.name;
      newSubCategory.updaterUsername = user.username;
      const result = await this.mSubCategoryRepository.update(
        {
          id: data.id
        },
        newSubCategory
      );
      return {
        isError: false,
        data: result,
        statusCode: 200
      };
    } catch (error) {
      console.error(error);
      return { isError: true, data: error.message, statusCode: 500 };
    }
  }

  async deleteSubCategory(data: DeleteGeneralPut, user) {
    try {
      let newSubCategory = new mSubCategory();
      newSubCategory.isDeleted = true;
      newSubCategory.updaterUsername = user.username;
      const result = await this.mSubCategoryRepository.update(
        {
          id: data.id
        },
        newSubCategory
      );
      return {
        isError: false,
        data: result,
        statusCode: 200
      };
    } catch (error) {
      console.error(error);
      return { isError: true, data: error.message, statusCode: 500 };
    }
  }

  async getMessageTemplate(data: GetTemplate) {
    try {
      const result = await this.mTemplateRepository.find({
        select: [
          "id",
          "message",
          "order",
          "template_type",
          "isActive",
          "isDeleted",
          "updaterUsername",
          "createdAt",
          "updatedAt"
        ],
        where: {
          isDeleted: false,
          isActive: true,
          template_type: data.templateType
        },
        take: data.limit === 0 ? 100000 : data.limit
      });
      return {
        isError: false,
        data: result,
        statusCode: 200
      };
    } catch (error) {
      console.error(error);
      return { isError: true, data: error.message, statusCode: 500 };
    }
  }

  async getMessageTemplatePost(payload: GeneralTablePost) {
    try {
      const page = (payload.page - 1) * payload.limit;
      let keywords = payload.keywords || [];

      let sql = this.mTemplateRepository
        .createQueryBuilder("m_template")
        .select([
          "m_template.id",
          "m_template.message",
          "m_template.order",
          "m_template.template_type",
          "m_template.isActive",
          "m_template.isDeleted",
          "m_template.updaterUsername",
          "m_template.createdAt",
          "m_template.updatedAt"
        ]);

      keywords.forEach((keyword) => {
        const keywordKey = keyword.key.trim();
        const keywordValue = keyword.value;
        // console.log(`m_template.${keywordKey} LIKE ${keywordValue}`);
        sql.andWhere(`m_template.${keywordKey} LIKE :${keywordKey}`, {
          [keywordKey]: `%${keywordValue}%`
        });
      });

      const count = await sql.getCount();
      sql.skip(page);
      sql.take(payload.limit);

      const result = await sql.getMany();

      const output = {
        totalData: count,
        listData: result
      };
      return {
        isError: false,
        data: output,
        statusCode: 200
      };
    } catch (error) {
      console.error(error);
      return { isError: true, data: error.message, statusCode: 500 };
    }
  }

  async addMessageTemplate(data: AddTemplatePost, user) {
    try {
      let newTemplate = new mTemplate();
      newTemplate.message = data.message;
      newTemplate.order = data.order;
      newTemplate.template_type = data.template_type;
      newTemplate.isActive = data.isActive;
      newTemplate.updaterUsername = user.username;
      const result = await this.mTemplateRepository.save(newTemplate);
      return {
        isError: false,
        data: result,
        statusCode: 200
      };
    } catch (error) {
      console.error(error);
      return { isError: true, data: error.message, statusCode: 500 };
    }
  }

  async editMessageTemplate(data: EdiTemplatePut, user) {
    try {
      let updatedTemplate = new mTemplate();
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          updatedTemplate[key] = data[key];
        }
      }
      updatedTemplate.updaterUsername = user.username;
      const result = await this.mTemplateRepository.update(
        {
          id: data.id
        },
        updatedTemplate
      );
      return {
        isError: false,
        data: result,
        statusCode: 200
      };
    } catch (error) {
      console.error(error);
      return { isError: true, data: error.message, statusCode: 500 };
    }
  }

  async deleteMessageTemplate(data: DeleteGeneralPut, user) {
    try {
      let deletedTemplate = new mTemplate();
      deletedTemplate.isDeleted = true;
      deletedTemplate.updaterUsername = user.username;
      const result = await this.mTemplateRepository.update(
        {
          id: data.id
        },
        deletedTemplate
      );
      return {
        isError: false,
        data: result,
        statusCode: 200
      };
    } catch (error) {
      console.error(error);
      return { isError: true, data: error.message, statusCode: 500 };
    }
  }
}
