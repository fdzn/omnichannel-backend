import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import {
  FastifyAdapter,
  NestFastifyApplication
} from "@nestjs/platform-fastify";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );
  const options = new DocumentBuilder()
    .setTitle("ON5 Demo")
    .setDescription("This is api documentation for ON5 Demo")
    .setVersion("1.0")
    .addTag("on5-demo")
    .setContact(
      "Dimas Apriliansyah",
      "https://github.com/dimasapriliansyah",
      "dimasapriliansy@gmail.com"
    )
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("api/application", app, document);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(parseInt(process.env.APP_PORT), "0.0.0.0");
}
bootstrap();
