import {
  Controller,
  Body,
  Post,
  Res,
  UseInterceptors,
  UploadedFiles,
} from "@nestjs/common";
import { Response } from "express";
import { FilesInterceptor } from "@nestjs/platform-express";
import { MinioNestService } from "./minio.service";
import { BufferedFile } from "./dto/file.model";
import {
  UploadPost,
  DownloadPost,
  UploadURLPost,
  uploadVCAPost,
} from "./dto/minio.dto";
@Controller("minio")
export class MinioController {
  constructor(private minioNestService: MinioNestService) {}
  @Post("upload")
  @UseInterceptors(FilesInterceptor("files"))
  async upload(
    @UploadedFiles() files: BufferedFile,
    @Body() dataPost: UploadPost,
    @Res() res: Response
  ) {
    const date = new Date();

    console.log("Upload", new Date(), JSON.stringify(dataPost));
    let result = await this.minioNestService.upload(files, dataPost);
    res.status(result.statusCode).send(result);
  }

  @Post("uploadURL")
  async uploadURL(@Body() dataPost: UploadURLPost, @Res() res: Response) {
    const date = new Date();
    console.log("uploadURL", new Date(), JSON.stringify(dataPost));
    let result = await this.minioNestService.uploadURL(dataPost);
    res.status(200).send(result);
  }

  @Post("download")
  async download(@Body() dataPost: DownloadPost, @Res() res: Response) {
    const date = new Date();
    console.log("Download", `${date} : ${JSON.stringify(dataPost)}`);
    let result = await this.minioNestService.download(dataPost);
    res.status(result.statusCode).send(result);
  }
}
