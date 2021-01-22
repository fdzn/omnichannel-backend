import { Injectable } from "@nestjs/common";
import { getRepository } from "typeorm";

//ENTITY
import { Customer } from "../../entity/customer.entity";
import { Contact } from "../../entity/contact.entity";

//DTO
import {
  AddContactPost,
  UpdateContactPut,
  UpdateCustomerPut,
  UpdateCustomerByKeyPut,
} from "./dto/customer.dto";
import { ContactData } from "src/dto/app.dto";
@Injectable()
export class CustomerService {
  async getById(id) {
    try {
      const repoCust = getRepository(Customer);
      const customerDetail = await repoCust.findOne({
        where: { id: id },
      });

      if (!customerDetail) {
        return {
          isError: true,
          data: "customer with that id is not found",
          statusCode: 404,
        };
      }

      return {
        isError: false,
        data: customerDetail,
        statusCode: 200,
      };
    } catch (error) {
      console.error(error);
      return { isError: true, data: error.message, statusCode: 500 };
    }
  }

  async updateCustomerByKey(data: UpdateCustomerByKeyPut) {
    try {
      let updateData = {};
      updateData[data.key] = data.value;

      const repoCust = getRepository(Customer);
      const result = await repoCust.update({ id: data.customerId }, updateData);
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

  async updateCustomer(id, payload: UpdateCustomerPut, user) {
    try {
      const repoCust = getRepository(Customer);

      const getData = await repoCust.findOne({
        where: { id: id },
      });

      if (!getData) {
        return {
          isError: true,
          data: "DATA NOT FOUND",
          statusCode: 404,
        };
      }
      let updateData = new Customer();
      updateData.address = payload.address ? payload.address : getData.address;
      updateData.city = payload.city ? payload.city : getData.city;
      updateData.company = payload.company ? payload.company : getData.company;
      updateData.email = payload.email ? payload.email : getData.email;
      updateData.gender = payload.gender ? payload.gender : getData.gender;
      updateData.name = payload.name ? payload.name : getData.name;
      updateData.phone = payload.phone ? payload.phone : getData.phone;
      updateData.priority = payload.priority
        ? payload.priority
        : getData.priority;
      updateData.telegram = payload.telegram
        ? payload.telegram
        : getData.telegram;
      updateData.updater = user.username;
      const result = await repoCust.update({ id: id }, updateData);
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

  async updateContact(data: UpdateContactPut) {
    try {
      let updateData = new Contact();
      updateData.value = data.value;
      const repoContact = getRepository(Contact);
      const result = await repoContact.update(
        { id: data.idContact },
        updateData
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

  async addContact(data: AddContactPost) {
    try {
      let insertData = new Contact();
      insertData.customerId = data.customerId;
      insertData.type = data.type;
      insertData.value = data.value;
      const repoContact = getRepository(Contact);
      const result = await repoContact.save(insertData);
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
  
  async generateCustomer(data: Customer, contact: ContactData) {
    const repoCustomer = getRepository(Customer);
    for (let key in contact) {
      let whereGenerated = {};
      whereGenerated[key] = contact[key];

      const getCustomer = await repoCustomer.findOne({
        where: whereGenerated,
      });

      if (getCustomer) {
        return getCustomer;
      }
    }
    let insertData = new Customer();
    insertData = data;
    insertData.phone = contact.phone ? contact.phone : undefined;
    insertData.email = contact.email ? contact.email : undefined;
    insertData.telegram = contact.telegram ? contact.telegram : undefined;
    const resultInsert = await repoCustomer.save(insertData);
    return resultInsert;
  }
}
