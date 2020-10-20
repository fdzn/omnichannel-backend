import { IsNotEmpty, IsInt, IsEnum } from "class-validator";

export class pickupManualPost {
  @IsNotEmpty()
  channelId: string;
}

export class pickupAutoPost {
  @IsNotEmpty()
  agentId: string;

  @IsNotEmpty()
  sessionId: string;
}

export class loadWorkOrderPost {
  @IsNotEmpty()
  channelId: string;
}

export class endPost {
  @IsNotEmpty()
  sessionId: string;

  @IsNotEmpty()
  channelId: string;
}

export enum PostType {
  INTERACTION = "interaction",
  HISTORY = "history",
}

export class GetInteractionPost {
  @IsNotEmpty()
  channelId: string;

  @IsNotEmpty()
  sessionId: string;

  @IsEnum(PostType)
  type: PostType;
}

export class GetInteractionSpecific {
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
  @IsNotEmpty()
  page: number;

  @IsEnum(PostType)
  @IsNotEmpty()
  type: PostType;
}

export class JourneyPost {
  @IsNotEmpty()
  @IsInt()
  customerId: number;

  @IsNotEmpty()
  @IsInt()
  page: number;
}
