import { Injectable } from "@nestjs/common";

import { VonagePost, IncomingVideoCall } from "./dto/incoming-videocall.dto";

@Injectable()
export class VideocallService {
  private channelId: string;
  constructor() {
    this.channelId = "videocall";
  }

  async vonage(dataPost: VonagePost) {
    //NORMALIZE
    //CREATE INCOMING
  }

  async incoming(data: IncomingVideoCall) {}

  async test(data) {}
}
