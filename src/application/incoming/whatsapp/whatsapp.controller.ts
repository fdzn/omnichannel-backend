import { Controller, Post, Res, Body, HttpCode } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { WhatsappService } from "./whatsapp.service";
import { CapiwhaPost } from "./dto/incoming-whatsapp.dto";

@Controller("incoming/whatsapp")
export class WhatsappController {
  constructor(private readonly whatsappService: WhatsappService) {}

  @ApiTags("Incoming")
  @Post("capiwha")
  @HttpCode(201)
  async capiwha(@Body() dataIncoming: CapiwhaPost, @Res() res: Response) {
    console.log("WHATSAPP CAPIWHA", new Date(), JSON.stringify(dataIncoming));
    const resultParse = await this.whatsappService.capiwha(dataIncoming);
    if (resultParse.isError) {
      res.status(resultParse.statusCode).send(resultParse);
    } else {
      const result = await this.whatsappService.incoming(resultParse.data);
      res.status(result.statusCode).send(result);
    }
  }
}
