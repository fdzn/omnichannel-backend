import { Injectable } from "@nestjs/common";

@Injectable()
export class EmailService {
  test() {
    return "This is /incoming/email/test route.";
  }
}
