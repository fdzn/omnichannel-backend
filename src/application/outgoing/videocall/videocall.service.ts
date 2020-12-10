import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

//SERVICE GLOBAL
import { LibsService } from "../../libs/services/lib.service";

//ENTITY
import { InteractionVideoCall } from "../../../entity/interaction_videocall.entity";
import { InteractionHeader } from "../../../entity/interaction_header.entity";

//DTO
import {
  OutgoingVideoCall,
  ActionVideoType,
} from "./dto/outgoing-videocall.dto";
@Injectable()
export class VideocallService {
  constructor(
    private readonly libsService: LibsService,
    @InjectRepository(InteractionVideoCall)
    private readonly videoCallRepository: Repository<InteractionVideoCall>,
    @InjectRepository(InteractionHeader)
    private readonly sessionRepository: Repository<InteractionHeader>
  ) {}

  async vonage(data: OutgoingVideoCall) {
    try {
        let result;
      if (data.action === ActionVideoType.ACCEPT) {
        let updateData = new InteractionHeader();
        updateData.isAbandon = false;
        result = await this.sessionRepository.update(
          { sessionId: data.sessionId },
          updateData
        );
      }

      if (data.action === ActionVideoType.HANGUP) {
        let updateData = new InteractionVideoCall;
        updateData.endDate = new Date();
        result = await this.sessionRepository.update(
          { sessionId: data.sessionId },
          updateData
        );
      }

      if (data.action === ActionVideoType.REJECT) {
        let updateData = new InteractionHeader();
        updateData.isAbandon = true;
        result = await this.sessionRepository.update(
          { sessionId: data.sessionId },
          updateData
        );
      }
      return {
        isError: false,
        data: "outgoing success",
        statusCode: 201,
      };
    } catch (error) {
      return this.libsService.parseError(error);
    }
  }
}
