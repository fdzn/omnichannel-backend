import { IsNotEmpty } from "class-validator";
import { Customer } from "../../../../entity/customer.entity";
import { ContactData } from "../../../../dto/app.dto";

export class IncomingWebchat {
  from: string;
  fromName: string;
  convId: string;
  message: string;
  messageType: string;
  media: any;
  account: string;
  dateSend: Date;
  dateStream: Date;
  contact: ContactData;
  customer: Customer;
}

export class CapiwhaPost {
  @IsNotEmpty()
  data: string;
}
