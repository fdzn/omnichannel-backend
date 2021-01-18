import { Entity } from "typeorm";
import { InteractionChat } from "./interaction_chat.entity";

@Entity()
export class InteractionChatHistory extends InteractionChat {}
