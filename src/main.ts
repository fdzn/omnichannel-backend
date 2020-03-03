import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import {
  FastifyAdapter,
  NestFastifyApplication
} from "@nestjs/platform-fastify";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";
// import { Transport } from "@nestjs/microservices";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );
  app.enableCors();
  // const microservice = app.connectMicroservice({
  //   transport: Transport.RMQ,
  //   options: {
  //     urls: ["amqp://guest:guest@localhost:5672/"],
  //     queue: "user-messages",
  //     noAck: false,
  //     queueOptions: {
  //       durable: false
  //     }
  //   }
  // });

  const options = new DocumentBuilder()
    .setTitle("Omnichannel Backend")
    .setDescription("This is api documentation for Omnichannel Backend")
    .setVersion("1.0")
    .addTag("on5-demo")
    .setContact(
      "Akhmad Faudzan Bakri",
      "https://github.com/fdzn",
      "faudzanbakri@gmail.com"
    )
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("api/application", app, document);
  app.useGlobalPipes(new ValidationPipe());
  // await app.startAllMicroservicesAsync();
  await app.listen(parseInt(process.env.APP_PORT), "0.0.0.0");
}
bootstrap();
