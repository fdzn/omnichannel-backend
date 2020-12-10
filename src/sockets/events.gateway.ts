import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from "@nestjs/websockets";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Socket, Server } from "socket.io";

//SERVICES
import { InteractionLibService } from "../application/libs/services/interaction.service";

//ENTITY
import { InteractionHeader } from "../entity/interaction_header.entity";

@WebSocketGateway()
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    @InjectRepository(InteractionHeader)
    private readonly sessionRepository: Repository<InteractionHeader>,
    private readonly interactionLibService: InteractionLibService
  ) {}

  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    console.log("Socket Start");
  }

  handleConnection(socket: Socket) {
    let userId = socket.handshake.query.username;
    let level = socket.handshake.query.level;
    let groupId = socket.handshake.query.groupId;
    socket.join(`${level}`);
    socket.join(`${level}:${userId}`);
    console.log("client connected", socket.handshake.query);
    this.jumQueueByChannel();
  }

  handleDisconnect(client: Socket) {
    console.log("Client disconnected", client.id);
  }

  sendData(room: string, event: string, data: object) {
    console.log(room, event, data);
    this.server.to(room).emit(event, data);
  }

  async jumQueueByChannel() {
    const result = await this.sessionRepository
      .createQueryBuilder("interaction_header")
      .select("channelId")
      .addSelect("COUNT(*) AS count")
      .groupBy("channelId")
      .getRawMany();
    let output = {};
    result.forEach((data, index) => {
      output[data.channelId] = parseInt(data.count);
    });
    this.sendData("agent", "countQueue", output);
  }
  async sendWorkOrder(data: InteractionHeader) {
    let workOrder;
    workOrder = data;
    workOrder.lastChat = await this.interactionLibService.getLastChat(
      data.channelId,
      data.sessionId
    );
    this.sendData(`agent:${data.agentUsername}`, "newQueue", workOrder);
    if (data.channelId === "videocall" && data.submitCwcDate === null) {
      let newData = workOrder.lastChat;
      newData["customerId"] = data.customerId;
      this.sendData(`agent:${data.agentUsername}`, "newVideoCall", newData);
    }
  }
}
