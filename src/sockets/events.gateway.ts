import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect
} from "@nestjs/websockets";
import { Socket, Server } from "socket.io";

@WebSocketGateway()
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
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
  }

  handleDisconnect(client: Socket) {
    console.log("Client disconnected", client.id);
  }

  sendData(room: string, event: string, data: object) {
    console.log(room, event, data);
    this.server.to(room).emit(event, data);
  }
}
