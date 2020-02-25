import { Inject } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

//schema
export class RabbitService {
  constructor(@Inject("HELLO_SERVICE") private readonly client: ClientProxy) {}

  getHello() {
    this.client.emit<any>("message_printed", { text: "hello fauzan" });
    return "Hello World printed";
  }
}
