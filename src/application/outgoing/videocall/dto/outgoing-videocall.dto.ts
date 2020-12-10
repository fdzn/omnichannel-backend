import { IsNotEmpty, IsEnum } from "class-validator";
export enum ActionVideoType {
  ACCEPT = "accept",
  REJECT = "reject",
  HANGUP = "hangup",
}
export class OutgoingVideoCall {
  @IsNotEmpty()
  sessionId: string;

  @IsEnum(ActionVideoType)
  action: ActionVideoType;
}
