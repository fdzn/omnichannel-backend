import { IsNotEmpty } from "class-validator";

import { Contact } from "../../../../dto/app.dto";
export class VonagePost {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  message: string;

  @IsNotEmpty()
  roomId: string;
}

export class IncomingVideoCall {
  from: string;
  fromName: string;
  convId: string;
  message: string;
  roomId: string;
  sessionId: string;
}
