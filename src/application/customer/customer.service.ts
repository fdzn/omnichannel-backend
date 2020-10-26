import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

//ENTITY
import { Customer, CustomerGender } from "../../entity/customer.entity";
import { Contact } from "../../entity/contact.entity";

//DTO
import {
  AddContactPost,
  GetCustomerDetailPost,
  UpdateContactPut,
  UpdateCustomerPut,
} from "./dto/customer.dto";
@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>
  ) {}

  async getById(data: GetCustomerDetailPost) {
    try {
      const customerDetail = await this.customerRepository.findOne({
        where: { id: data.custId },
      });

      if (!customerDetail) {
        return {
          isError: true,
          data: "customer with that id is not found",
          statusCode: 404,
        };
      }

      const contactDetail = await this.contactRepository.find({
        select: ["id", "type", "value", "avatar"],
        where: { customerId: customerDetail.id },
      });

      let output;
      output = customerDetail;
      output.contact = contactDetail;
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

  async updateCustomer(data: UpdateCustomerPut) {
    try {
      let updateData = {};
      updateData[data.key] = data.value;
      const result = await this.customerRepository.update(
        { id: data.customerId },
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

  async updateContact(data: UpdateContactPut) {
    try {
      let updateData = new Contact();
      updateData.value = data.value;
      const result = await this.contactRepository.update(
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
      const result = await this.contactRepository.save(insertData);
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
