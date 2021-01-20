import { Controller, Get } from "@nestjs/common";

@Controller()
export class AppController {
  @Get()
  getHello(): string {
    const date = new Date();
    return `Backend Service is running ${date}`;
  }
}
