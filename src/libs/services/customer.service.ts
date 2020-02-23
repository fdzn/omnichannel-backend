import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Customer } from "../../entity/customer.entity";
import { Contact } from "../../entity/contact.entity";

//schema
@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>
  ) {}

  async checkContactType(channelId: string): Promise<string> {
    switch (channelId) {
      case "whatsapp":
        return "hp";
      case "telegram":
        return "telegram";
      case "email":
        return "email";
      default:
        return "hp";
    }
  }

  async checkContact(contactType: string, contactId: string): Promise<Contact> {
    const foundContact = await this.contactRepository.findOne({
      where: { value: contactId, type: contactType }
    });
    return foundContact;
  }

  async create(contactType: string, data): Promise<Customer> {
    let insertCustomer = new Customer();
    insertCustomer.name = data.fromName;
    const resultInsertCustomer = await this.customerRepository.save(
      insertCustomer
    );

    let insertContact = new Contact();
    insertContact.customerId = resultInsertCustomer.id;
    insertContact.type = contactType;
    insertContact.value = data.from;
    insertContact.avatar = data.avatar ? data.avatar : null;
    const resultInsertContact = await this.contactRepository.save(
      insertContact
    );

    return resultInsertCustomer;
  }
}
