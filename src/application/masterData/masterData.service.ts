import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Brackets, IsNull } from "typeorm";

//ENTITY
import { mCategory } from "../../entity/m_category.entity";
import { mSubCategory } from "../../entity/m_sub_category.entity";
import { mTemplate } from "../../entity/m_template.entity";
import { WorkOrder } from "../../entity/work_order.entity";
import { User } from "../../entity/user.entity";
import { AgentLog } from "../../entity/agent_log.entity";
import { mGroup } from "../../entity/m_group.entity";

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
  AddUserPost,
  EditTemplatePut,
  EditUserPut,
  DeleteUser,
  AddWorkOrderPost,
  EditWorkOrderPut,
  AddGroupIdPost,
  EditGroupIdPut
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
    @InjectRepository(AgentLog)
    private readonly agentLogRepository: Repository<AgentLog>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(WorkOrder)
    private readonly workOrderRepository: Repository<WorkOrder>,
    @InjectRepository(mGroup)
    private readonly mGroupRepository: Repository<mGroup>
  ) {}

  async getCategoryPost(payload: GeneralTablePost) {
    try {
      const page = (payload.page - 1) * payload.limit;
      let keywords = payload.keywords || [];
      // let keyword = "";
      // if (payload.keyword) {
      //   if (payload.keyword.trim() !== "") {
      //     keyword = payload.keyword;
      //   }
      // }

      let sql = this.mCategoryRepository
        .createQueryBuilder("category")
        .select([
          "category.id",
          "category.name",
          "category.isActive",
          "category.isDeleted",
          "category.updaterUsername",
          "category.updatedAt"
        ]);
      // .where("category.isActive = true")
      // .andWhere("category.isDeleted = false");

      keywords.forEach((keyword) => {
        const keywordKey = keyword.key.trim();
        const keywordValue = keyword.value;
        // console.log(`work_order.${keywordKey} LIKE ${keywordValue}`);
        sql.andWhere(`category.${keywordKey} LIKE :${keywordKey}`, {
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

  async getSubCategoryPost(payload: GeneralTablePost) {
    try {
      const page = (payload.page - 1) * payload.limit;
      let keywords = payload.keywords || [];
      // let keyword = "";
      // if (payload.keyword) {
      //   if (payload.keyword.trim() !== "") {
      //     keyword = payload.keyword;
      //   }
      // }

      let sql = this.mSubCategoryRepository
        .createQueryBuilder("subCategory")
        .select([
          "category.id",
          "category.name",
          "subCategory.id",
          "subCategory.isActive",
          "subCategory.isDeleted",
          "subCategory.name",
          "subCategory.updaterUsername",
          "subCategory.updatedAt"
        ])
        .leftJoin("subCategory.category", "category");
      // .where("subCategory.isActive = true")
      // .andWhere("category.isActive = true")
      // .andWhere("subCategory.isDeleted = false")
      // .andWhere("category.isDeleted = false");

      // if (keyword !== "") {
      //   sql.andWhere(
      //     new Brackets((qb) => {
      //       qb.where("subCategory.name LIKE :keyword", {
      //         keyword: `%${keyword}%`,
      //       }).orWhere("category.name LIKE :keyword", {
      //         keyword: `%${keyword}%`,
      //       });
      //     })
      //   );
      // }

      keywords.forEach((keyword) => {
        const keywordKey = keyword.key.trim();
        const keywordValue = keyword.value;
        if (keywordKey.includes("category.")) {
          sql.andWhere(`${keywordKey} LIKE :${keywordKey}`, {
            [keywordKey]: `%${keywordValue}%`
          });
        } else {
          // console.log(`work_order.${keywordKey} LIKE ${keywordValue}`);
          sql.andWhere(`subCategory.${keywordKey} LIKE :${keywordKey}`, {
            [keywordKey]: `%${keywordValue}%`
          });
        }
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

  async addUser(data: AddUserPost, user) {
    try {
      let newUser = new User();
      newUser.username = data.username;
      newUser.name = data.name;
      newUser.password = data.password;
      newUser.level = data.level;
      newUser.phone = data.phone;
      newUser.email = data.email;
      newUser.unitId = data.unitId;
      newUser.groupId = data.groupId;
      newUser.updater = user.username;
      const result = await this.userRepository.save(newUser);
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

  async editUser(data: EditUserPut, user) {
    try {
      let updatedUser = new User();

      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          if (key === "newUsername") {
            updatedUser["username"] = data[key];
            updatedUser["isLogin"] = false;
          } else {
            updatedUser[key] = data[key];
          }
        }
      }

      updatedUser.updater = user.username;

      const result = await this.userRepository.update(
        {
          username: data.username
        },
        updatedUser
      );

      if (data.hasOwnProperty("newUsername")) {
        await this.agentLogRelease(
          updatedUser["username"],
          user.username,
          "Release because Username Changed"
        );
      }
      if (
        !data.hasOwnProperty("newUsername") &&
        updatedUser.hasOwnProperty("isLogin")
      ) {
        await this.agentLogRelease(updatedUser["username"], user.username);
      }

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

  async deleteUser(data: DeleteUser, user) {
    try {
      let deletedUser = new User();
      deletedUser.isDeleted = true;
      deletedUser.isLogin = false;
      deletedUser.updater = user.username;
      const result = await this.userRepository.update(
        {
          username: data.username
        },
        deletedUser
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
      newCategory.isActive = data.isActive;
      newCategory.isDeleted = data.isDeleted;
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
      newSubCategory.isActive = data.isActive;
      newSubCategory.isDeleted = data.isDeleted;
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

  async editMessageTemplate(data: EditTemplatePut, user) {
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

  async getWorkOrderPost(payload: GeneralTablePost) {
    try {
      const page = (payload.page - 1) * payload.limit;
      let keywords = payload.keywords || [];

      let sql = this.workOrderRepository
        .createQueryBuilder("work_order")
        .select([
          "work_order.id",
          "work_order.agentUsername",
          "work_order.channelId",
          "work_order.limit",
          "work_order.slot",
          "work_order.lastDist",
          "work_order.createdAt",
          "work_order.updatedAt",
          "work_order.updaterUsername"
        ]);

      keywords.forEach((keyword) => {
        const keywordKey = keyword.key.trim();
        const keywordValue = keyword.value;
        // console.log(`work_order.${keywordKey} LIKE ${keywordValue}`);
        sql.andWhere(`work_order.${keywordKey} LIKE :${keywordKey}`, {
          [keywordKey]: `%${keywordValue}%`
        });
      });

      const count = await sql.getCount();
      sql.skip(page);
      sql.take(payload.limit);
      sql.orderBy("work_order.agentUsername", "ASC");
      sql.addOrderBy("work_order.channelId", "DESC");

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

  async addWorkOrder(data: AddWorkOrderPost, user) {
    try {
      let newWorkOrder = new WorkOrder();
      newWorkOrder.agentUsername = data.agentUsername;
      newWorkOrder.channelId = data.channelId;
      newWorkOrder.limit = data.limit;
      newWorkOrder.updaterUsername = user.username;
      if (
        data.channelId.toLowerCase() === "videocall" ||
        data.channelId.toLowerCase() === "voice"
      ) {
        newWorkOrder.limit = 1;
      }
      const result = await this.workOrderRepository.save(newWorkOrder);
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

  async editWorkOrder(data: EditWorkOrderPut, user) {
    try {
      let updatedWorkOrder = new WorkOrder();
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          updatedWorkOrder[key] = data[key];
        }
      }
      updatedWorkOrder.updaterUsername = user.username;
      if (
        data.channelId.toLowerCase() === "videocall" ||
        data.channelId.toLowerCase() === "voice"
      ) {
        updatedWorkOrder.limit = 1;
      }
      const result = await this.workOrderRepository.update(
        {
          id: data.id
        },
        updatedWorkOrder
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

  async agentLogRelease(username, updater, info = null) {
    try {
      // Update Agent Log
      const foundUser = await this.agentLogRepository.findOne({
        select: ["id", "username"],
        where: {
          username,
          timeEnd: IsNull()
        }
      });

      console.log("foundUser release", foundUser);

      if (foundUser) {
        let updateAgentLog = new AgentLog();

        updateAgentLog.logoutReason = "release";
        updateAgentLog.info = info;
        updateAgentLog.timeEnd = new Date();
        updateAgentLog.updater = updater;

        return await this.agentLogRepository.update(
          {
            username: foundUser.username,
            timeEnd: IsNull()
          },
          updateAgentLog
        );
      }

      return;
    } catch (error) {
      throw error;
    }
  }

  async getGroupIdPost(payload: GeneralTablePost) {
    try {
      const page = (payload.page - 1) * payload.limit;
      let keywords = payload.keywords || [];

      let sql = this.mGroupRepository
        .createQueryBuilder("m_group")
        .select([
          "m_group.id",
          "m_group.name",
          "m_group.isActive",
          "m_group.isDeleted",
          "m_group.createdAt",
          "m_group.updatedAt",
          "m_group.updaterUsername"
        ]);

      keywords.forEach((keyword) => {
        const keywordKey = keyword.key.trim();
        const keywordValue = keyword.value;
        sql.andWhere(`m_group.${keywordKey} LIKE :${keywordKey}`, {
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

  async addGroupId(data: AddGroupIdPost, user) {
    try {
      let newGroupId = new mGroup();
      newGroupId.name = data.name;
      newGroupId.updaterUsername = user.username;
      const result = await this.mGroupRepository.save(newGroupId);
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

  async editGroupId(data: EditGroupIdPut, user) {
    try {
      let updatedGroupId = new mGroup();
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          updatedGroupId[key] = data[key];
        }
      }
      updatedGroupId.updaterUsername = user.username;
      const result = await this.mGroupRepository.update(
        {
          id: data.id
        },
        updatedGroupId
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
  async deleteGroupId(data: DeleteGeneralPut, user) {
    try {
      let deletedGroupId = new mGroup();
      deletedGroupId.isDeleted = true;
      deletedGroupId.updaterUsername = user.username;
      const result = await this.mGroupRepository.update(
        {
          id: data.id
        },
        deletedGroupId
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
