import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { SessionService } from "../../libs/services/session.service";
import { CustomerService } from "../../libs/services/customer.service";

@Injectable()
export class TelegramService {
  private channelId: string;
  constructor(
    @InjectModel("Interaction")
    private readonly interactionTelegramModel,
    private readonly sessionService: SessionService,
    private readonly customerService: CustomerService
  ) {
    this.channelId = "telegram";
  }

  test() {
    return "/incoming/telegram/test";
  }
  normalization(createIncomingtelegram, sessionId, channelId) {
    const {
      message,
      messageType,
      from,
      fromName,
      convId,
      streamId,
      streamToId
    } = createIncomingtelegram;

    return {
      sessionId,
      channelId,
      message,
      messageType,
      dateCreateInteraction: new Date(),
      from: {
        id: from,
        name: fromName
      },
      reference: {
        convId,
        streamId,
        streamToId
      },
      duration: 0,
      actionType: "IN",
      updater: "SYSTEM",
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
  async createIncoming(createIncomingtelegram) {
    const {
      message,
      messageType,
      from,
      fromName,
      ...reference
    } = createIncomingtelegram;

    let sessionId;
    let custId;
    const detailSession = await this.sessionService.find(this.channelId, from);

    if (detailSession) {
      sessionId = detailSession.sessionId;
      custId = detailSession.custId;
    } else if (!detailSession) {
      sessionId = this.sessionService.generate(this.channelId);

      const detailCustomer = await this.customerService.find(
        this.channelId,
        from
      );

      if (detailCustomer) {
        // custId = detailCustomer.id;
        custId = 1;
      } else if (!detailCustomer) {
        const { id } = await this.customerService.create(
          this.channelId,
          from,
          fromName
        );
        custId = id;
      }

      await this.sessionService.create(
        sessionId,
        this.channelId,
        custId,
        createIncomingtelegram
      );
    }

    const insertInteraction = new this.interactionTelegramModel(
      this.normalization(createIncomingtelegram, sessionId, this.channelId)
    );

    return await insertInteraction.save();
  }
}
