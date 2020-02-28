import { IsNotEmpty, IsInt, IsEnum } from "class-validator";

export class pickupManualPost {
  @IsNotEmpty()
  agentId: string;

  @IsNotEmpty()
  @IsInt()
  groupId: number;

  @IsNotEmpty()
  channelId: string;
}

export class pickupAutoPost {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  sessionId: string;
}

export class loadWorkOrderPost {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  channelId: string;
}

export class endPost {
  @IsNotEmpty()
  sessionId: string;
}

export enum PostType {
  "interaction",
  "history"
}

export class GetInteractionPost {
  @IsNotEmpty()
  channelId: string;

  @IsNotEmpty()
  sessionId: string;

  @IsEnum(PostType)
  type: PostType;
}

export class GetInteractionByCustomerPost {
  @IsNotEmpty()
  channelId: string;

  @IsNotEmpty()
  from: string;

  @IsInt()
  page: number;

  @IsEnum(PostType)
  type: PostType;
}
