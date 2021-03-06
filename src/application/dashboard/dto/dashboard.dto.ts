import {
  IsString,
  registerDecorator,
  ValidationOptions,
} from "class-validator";

export function IsOnlyDate(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "IsOnlyDate",
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: {
        message: "Please provide only date like 2020-12-08",
        ...validationOptions,
      },
      validator: {
        validate(value: any) {
          const regex = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;
          return typeof value === "string" && regex.test(value);
        },
      },
    });
  };
}

export class ParamGeneral {
  @IsOnlyDate()
  dateTo: string;
  @IsOnlyDate()
  dateFrom: string;
  @IsString()
  agentUsername: string;
  @IsString()
  channelId: string;
}

export class ParamGeneralLimit {
  @IsOnlyDate()
  dateTo: string;
  @IsOnlyDate()
  dateFrom: string;
  @IsString()
  agentUsername: string;
  @IsString()
  channelId: string;
  @IsString()
  limit: string;
}

export class ParamListQueue {
  @IsString()
  agentUsername: string;
  @IsString()
  channelId: string;
  @IsString()
  page: string;
  @IsString()
  limit: string;
}

export class ParamLogInteraction {
  @IsOnlyDate()
  dateTo: string;
  @IsOnlyDate()
  dateFrom: string;
  @IsString()
  agentUsername: string;
  @IsString()
  channelId: string;
  @IsString()
  page: string;
}

export class ParamTotalHandled {
  @IsOnlyDate()
  dateTo: string;
  @IsOnlyDate()
  dateFrom: string;
  @IsString()
  agentUsername: string;
}
