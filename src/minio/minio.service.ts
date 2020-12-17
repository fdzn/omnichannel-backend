import { Injectable, HttpService } from "@nestjs/common";
import { LibsService } from "../application/libs/services/lib.service";
import { MinioService } from "nestjs-minio-client";
import { BufferedFile, BufferedFileClass } from "./dto/file.model";
import * as crypto from "crypto";
import {
  UploadPost,
  UploadURLPost,
  uploadVCAPost,
  DownloadPost,
  ResultDownload,
} from "./dto/minio.dto";
@Injectable()
export class MinioNestService {
  constructor(
    private readonly minio: MinioService,
    private http: HttpService,
    private readonly libsService: LibsService
  ) {}

  private readonly expireTime = parseInt(process.env.MINIO_EXPIRE_TIME);
  private readonly minio_key = process.env.MINIO_KEY;
  private readonly iv_key = "infomedianusanta";
  public get client() {
    return this.minio.client;
  }

  //MASTER FUNCTION
  encrypt(data: string) {
    crypto.createCipheriv;
    let mykey = crypto.createCipheriv(
      "aes-128-cbc",
      this.minio_key,
      this.iv_key
    );
    let mystr = mykey.update(data, "utf8", "hex");
    mystr += mykey.final("hex");
    return mystr;
  }

  decrypt(data: string) {
    var mykey = crypto.createDecipheriv(
      "aes-128-cbc",
      this.minio_key,
      this.iv_key
    );
    var mystr = mykey.update(data, "hex", "utf8");
    mystr += mykey.final("utf8");
    return mystr;
  }

  async getMetaData(url: string) {
    let metaData;
    await this.http
      .head(url)
      .toPromise()
      .then((response) => (metaData = response));
    return metaData;
  }

  async uploadSingle(file: BufferedFile, data: UploadPost) {
    data.folder = data.folder.replace("_", "").replace(" ", "");
    const baseBucket = data.folder;

    const checkBucket = await this.client.bucketExists(baseBucket);
    if (!checkBucket) {
      await this.client.makeBucket(baseBucket, "us-east-1");
    }

    let temp_filename = Date.now().toString();
    let hashedFileName = crypto
      .createHash("md5")
      .update(temp_filename)
      .digest("hex");
    let ext = file.originalname.substring(
      file.originalname.lastIndexOf("."),
      file.originalname.length
    );

    const metaData = {
      "Content-Type": file.mimetype,
      "Origin-Filename": file.originalname,
    };

    let filename = hashedFileName + ext;
    const fileName: string = `${data.directory}/${filename}`;
    const fileBuffer = file.buffer;
    const fileSize = file.size;
    const token = this.encrypt(`${baseBucket}:${fileName}`);
    const resultUpload = await this.client.putObject(
      data.folder,
      fileName,
      fileBuffer,
      fileSize,
      metaData
    );
    const resultDownload = await this.client.presignedUrl(
      "GET",
      data.folder,
      fileName,
      this.expireTime
    );
    let output = new ResultDownload();

    output.fileName = filename;
    output.mimeType = file.mimetype;
    output.originFileName = file.originalname;
    output.size = fileSize;
    output.token = token;
    output.url = resultDownload;
    return output;
  }

  async uploadURLSingle(url: string, uploadData: UploadPost) {
    const configGet = { responseType: "arraybuffer" };
    const resultGet = await this.libsService.getHTTP(url, configGet);
    if (resultGet.isError) {
      throw new Error(`${resultGet.statusCode} : ${resultGet.data}`);
    }
    const fileBuffer = resultGet.data;
    const filename = url.replace(/^.*[\\\/]/, "");
    const headers = fileBuffer.headers;
    if (headers["content-type"] == "application/octet-stream") {
      const extension = url.substring(url.lastIndexOf(".")).replace(".", "");
      headers["content-type"] = this.libsService.defineMimetype(extension);
    }
    let file = new BufferedFileClass();
    file.originalname = filename.split("?")[0];
    file.buffer = fileBuffer.data;
    file.mimetype = headers["content-type"];
    file.size = parseInt(headers["content-length"]);
    const resultUpload = await this.uploadSingle(file, uploadData);
    return resultUpload;
  }
  //END MASTER FUNCTION

  async upload(files, data: UploadPost) {
    try {
      let output = [];
      for (let index = 0; index < files.length; index++) {
        const resultUpload = await this.uploadSingle(files[index], data);
        output.push(resultUpload);
      }

      return {
        isError: false,
        data: output,
        statusCode: 201,
      };
    } catch (e) {
      return this.libsService.parseError(e);
    }
  }

  async download(post: DownloadPost) {
    try {
      const decryptToken = this.decrypt(post.token);
      const decryptTokenArray = decryptToken.split(":");
      const bucket = decryptTokenArray[0];
      const filename = decryptTokenArray[1];
      const resultDownload = await this.client.presignedUrl(
        "GET",
        bucket,
        filename,
        this.expireTime
      );
      return {
        isError: false,
        data: {
          url: resultDownload,
        },
        statusCode: 201,
      };
    } catch (e) {
      return this.libsService.parseError(e);
    }
  }

  async uploadURL(data: UploadURLPost) {
    try {
      let output = [];
      let uploadData = new UploadPost();
      uploadData.directory = data.directory;
      uploadData.folder = data.folder;
      for (let index = 0; index < data.url.length; index++) {
        const resultUpload = await this.uploadURLSingle(
          data.url[index],
          uploadData
        );
        output.push(resultUpload);
      }

      return {
        isError: false,
        data: output,
        statusCode: 201,
      };
    } catch (e) {
      return this.libsService.parseError(e);
    }
  }

  async uploadVCA(data: uploadVCAPost) {
    try {
      let output = [];
      let uploadData = new UploadPost();
      uploadData.directory = data.directory;
      uploadData.folder = data.folder;
      for (let index = 0; index < data.url.length; index++) {
        const resultUpload = await this.uploadURLSingle(
          data.url[index],
          uploadData
        );
        output.push(resultUpload);
      }
      let postimage = {
        vonageId: data.vonageId,
        sessionId: data.sessionId,
        tenantId: data.tenantId,
        internalURL: JSON.stringify(output),
      };

      // const url = `https://interacton4.infomedia.co.id:3010/recording/internal/${data.tenantId}/vonage`;
      this.http
        .post(data.callbackURL, postimage)
        .toPromise()
        .then(function (response) {
          console.log("RESPONSE", response.data);
        });
      return {
        isError: false,
        data: output,
        statusCode: 201,
      };
    } catch (e) {
      return this.libsService.parseError(e);
    }
  }
}
