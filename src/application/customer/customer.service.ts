import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Customer, CustomerGender } from "../../entity/customer.entity";
import { Contact } from "../../entity/contact.entity";

import { GetCustomerDetailPost } from "./dto/customer.dto";
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
        where: { id: data.custId }
      });

      if (!customerDetail) {
        return {
          isError: true,
          data: "customer with that id is not found",
          statusCode: 404
        };
      }

      const contactDetail = await this.contactRepository.find({
        select: ["type", "value", "avatar"],
        where: { customerId: customerDetail.id }
      });

      let output;
      output = customerDetail;
      output.contact = contactDetail;
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
}
