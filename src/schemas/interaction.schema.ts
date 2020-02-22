import * as mongoose from "mongoose";

export const InteractionSchema = new mongoose.Schema({
  sessionId: String,
  channelId: String,
  message: String,
  media: [Object],
  messageType: String,
  dateCreateInteraction: Date,
  from: {
    id: String,
    name: String
  },
  reference: Object,
  duration: Number,
  actionType: String,
  updater: String,
  createdAt: Date,
  updatedAt: Date
});
