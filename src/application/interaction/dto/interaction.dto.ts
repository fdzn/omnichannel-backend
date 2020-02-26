import { IsNotEmpty, IsInt } from "class-validator";

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
  agentId: string;

  @IsNotEmpty()
  sessionId: string;
}
