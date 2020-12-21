import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

//ENTITY
import { Customer } from "../../../entity/customer.entity";
import { Contact } from "../../../entity/contact.entity";

import { ContactApp } from "../../../dto/app.dto";
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
      case "videocall":
        return "email";
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
      where: { value: contactId, type: contactType },
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

  async createFromScratch(
    contactData: ContactApp[],
    customerData: Customer
  ): Promise<Customer> {
    const resultInsertCustomer = await this.customerRepository.save(
      customerData
    );

    for (let index = 0; index < contactData.length; index++) {
      const element = contactData[index];
      let insertContact = new Contact();
      insertContact.customerId = resultInsertCustomer.id;
      insertContact.type = element.type;
      insertContact.value = element.value;
      insertContact.avatar = element.avatar ? element.avatar : null;
      const resultInsertContact = await this.contactRepository.save(
        insertContact
      );
    }
    return resultInsertCustomer;
  }

  async checkContactV2(contact: ContactApp): Promise<Contact> {
    const foundContact = await this.contactRepository.findOne({
      where: { value: contact.value },
    });
    return foundContact;
  }

  async checkContactWithCustId(custId: number, ContactData: ContactApp[]) {
    for (let index = 0; index < ContactData.length; index++) {
      const element = ContactData[index];
      const foundContact = await this.checkContactV2(element);

      if (!foundContact) {
        let insertContact = new Contact();
        insertContact.customerId = custId;
        insertContact.type = element.type;
        insertContact.value = element.value;
        insertContact.avatar = element.avatar ? element.avatar : null;
        const resultInsertContact = await this.contactRepository.save(
          insertContact
        );
      }
    }
  }

  async generate(contact: ContactApp[], data: Customer) {
    let custId = null;
    for (let index = 0; index < contact.length; index++) {
      const element = contact[index];
      const checkContact = await this.checkContactV2(element);
      if (checkContact) {
        custId = checkContact.customerId;
        break;
      }
    }

    if (!custId) {
      const detailCust = await this.createFromScratch(contact, data);
      custId = detailCust.id;
    } else {
      this.checkContactWithCustId(custId, contact);
    }

    return custId;
  }

  async getById(custId: number) {
    return this.customerRepository.findOne({
      where: { id: custId },
    });
  }
}
