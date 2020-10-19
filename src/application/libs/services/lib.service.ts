import { Injectable, HttpService } from "@nestjs/common";

@Injectable()
export class LibsService {
  constructor(private http: HttpService) {
    this.http.axiosRef.interceptors.request.use((x) => {
      x["requestAt"] = new Date().getTime();
      return x;
    });

    this.http.axiosRef.interceptors.response.use(
      (x) => {
        if (typeof x.config !== "undefined") {
          const requestAt = x.config["requestAt"]
            ? x.config["requestAt"]
            : new Date().getTime();
          let responseTime = new Date().getTime() - requestAt;
          const log = {
            url: x.config.url,
            method: x.config.method,
            payload: x.config.data,
            responseTime: responseTime,
            data: Buffer.isBuffer(x.data)
              ? "BUFFER FILE"
              : JSON.stringify(x.data),
            responseStatus: x.status,
          };
          return x;
        }
      },
      (x) => {
        if (typeof x.config !== "undefined") {
          let responseTime = new Date().getTime() - x.config["requestAt"];
          const log = {
            url: x.config.url,
            method: x.config.method,
            payload: x.config.data,
            responseTime: responseTime,
            data: x.response ? JSON.stringify(x.response.data) : undefined,
            responseStatus: x.response ? x.response.status : undefined,
          };
        }
        throw x;
      }
    );
  }

  isJson(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }
  parseError(e) {
    const date = new Date();
    if (typeof e.isAxiosError !== "undefined") {
      let canHandleError = true;

      if (typeof e.response !== "undefined") {
        if (typeof e.response.data !== "undefined") {
          console.error(`ERROR FROM AXIOS ${date} :`, e.response.data);
        } else {
          canHandleError = false;
          console.error(`ERROR FROM AXIOS ${date} :`, e);
        }
      } else {
        canHandleError = false;
        console.error(`ERROR FROM AXIOS ${date} :`, e);
      }

      if (canHandleError) {
        return {
          isError: true,
          data: `${e.response.statusText}`,
          statusCode: e.response.status,
        };
      } else {
        return {
          isError: true,
          data: `${e.message}`,
          statusCode: 500,
        };
      }
    } else {
      console.error(`ERROR NEST ${date} :`, e);
      return { isError: true, data: e.message, statusCode: 500 };
    }
  }

  validURL(str) {
    var pattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
      "i"
    ); // fragment locator
    return !!pattern.test(str);
  }

  defineMimetype(extension: string) {
    let type = "application";
    switch (extension) {
      case "jpg":
        type = "image";
        break;
      case "png":
        type = "image";
        break;
      case "jpeg":
        type = "image";
        break;
      case "gif":
        type = "image";
        break;

      case "mp4":
        type = "video";
        break;
      case "mkv":
        type = "video";
        break;
      case "3gp":
        type = "video";
        break;
      case "mpg":
        type = "video";
        break;
      case "mpeg":
        type = "video";
        break;

      case "ogg":
        type = "audio";
        break;
      case "mp3":
        type = "audio";
        break;
      case "gsm":
        type = "audio";
        break;
      case "flac":
        type = "audio";
        break;
      default:
        type = "application";
        break;
    }

    return `${type}/${extension}`;
  }

  async postHTTP(url, dataPost, config = null) {
    try {
      const date = new Date();
      console.log("POST URL", `${date} : ${url}`);
      console.log("POST HTTP", `${date} : ${JSON.stringify(dataPost)}`);
      const result = await this.http.post(url, dataPost, config).toPromise();
      return {
        isError: false,
        data: result.data,
        statusCode: 200,
      };
    } catch (e) {
      return this.parseError(e);
    }
  }

  async getHTTP(url, config = null) {
    try {
      const date = new Date();
      console.log("GET URL", `${date} : ${url}`);
      const result = await this.http.get(url, config).toPromise();
      return {
        isError: false,
        data: result,
        statusCode: 200,
      };
    } catch (e) {
      return this.parseError(e);
    }
  }

  async putHTTP(url, dataPost, config = null) {
    try {
      const date = new Date();
      console.log("PUT URL", `${date} : ${url}`);
      console.log("PUT HTTP", `${date} : ${JSON.stringify(dataPost)}`);

      const result = await this.http.put(url, dataPost, config).toPromise();
      return {
        isError: false,
        data: result,
        statusCode: 200,
      };
    } catch (e) {
      return this.parseError(e);
    }
  }

  async deleteHTTP(url, config) {
    try {
      const date = new Date();
      console.log("DELETE URL", `${date} : ${url}`);
      const result = await this.http.delete(url, config).toPromise();
      return {
        isError: false,
        data: result,
        statusCode: 200,
      };
    } catch (e) {
      return this.parseError(e);
    }
  }
}
