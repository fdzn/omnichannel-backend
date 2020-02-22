import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CustomerInterface } from "../../schemas/customer.schema";

//schema
@Injectable()
export class CustomerService {
  constructor(
    @InjectModel("Customer")
    private readonly customerModel: Model<CustomerInterface>
  ) {}

  async find(channelId: string, contactId: string): Promise<CustomerInterface> {
    const foundCustomer = await this.customerModel.findOne({
      contact: [{ type: channelId, detail: { id: contactId } }]
    });
    return foundCustomer;
  }

  async create(channelId: string, from: string, fromName: string) {
    const insertCustomer = new this.customerModel({
      custName: fromName,
      contact: [
        {
          type: channelId,
          detail: {
            id: from,
            name: fromName
          }
        }
      ]
    });
    return await insertCustomer.save();
  }
}
