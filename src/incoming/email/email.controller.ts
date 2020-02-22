import { Controller, Get } from "@nestjs/common";
import { EmailService } from "./email.service";

@Controller("incoming/email")
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Get("/test")
  testRoute(): string {
    return this.emailService.test();
  }
}
