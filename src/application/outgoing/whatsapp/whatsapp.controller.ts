import {
  Controller,
  Post,
  Res,
  Body,
  Request,
  HttpCode,
  UseGuards,
} from "@nestjs/common";
import { Response } from "express";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
//GUARD
import { JwtAuthGuard } from "../../auth/guards/jwt.auth.guard";

//SERVICE
import { WhatsappService } from "./whatsapp.service";

//DTO
import { OutgoingWhatsapp } from "./dto/outgoing-whatsapp.dto";

@ApiBearerAuth()
@ApiTags("Outgoing")
@Controller("outgoing/whatsapp")
export class WhatsappController {
  constructor(private readonly whatsappService: WhatsappService) {}
  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(200)
  async outgoing(
    @Request() payload,
    @Body() dataOutgoing: OutgoingWhatsapp,
    @Res() res: Response
  ) {
    console.log("OUTGOING WHATSAPP", JSON.stringify(dataOutgoing));

    const resultSave = await this.whatsappService.saveInteraction(
      dataOutgoing,
      payload.user
    );
    res.status(200).send(resultSave);

    await this.whatsappService.capiwha(dataOutgoing, resultSave, payload.user);
  }
}
