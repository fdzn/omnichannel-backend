import { IsNotEmpty, IsBoolean, IsInt, IsDateString } from "class-validator";

export class UpdateAuxPost {
  @IsBoolean()
  auxStatus: boolean;
}

export class UpdateWorkOrderPost {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  channelId: string;

  @IsNotEmpty()
  @IsInt()
  slot: number;

  @IsNotEmpty()
  @IsDateString()
  lastDist: Date;
}

export class PickupPost {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  sessionId: string;
}
