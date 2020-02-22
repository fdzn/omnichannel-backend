import * as mongoose from "mongoose";

export const SessionSchema = new mongoose.Schema({
  sessionId: String,
  contactId: String,
  custId: mongoose.SchemaTypes.ObjectId,
  channelId: String,
  agentId: String,
  groupId: Number,
  priority: Number,
  dateCreateSession: Date,
  datePickupSession: [
    {
      agentId: String,
      date: Date
    }
  ],
  dateFirstResponse: Date,
  dateEndSession: Date,
  detailCwc: {
    categoryId: Number,
    remark: String,
    feedback: String,
    sentimentId: String,
    dateSubmit: Date
  },
  ticketId: [String],
  createdAt: Date,
  updatedAt: Date
});

export interface SessionInterface extends mongoose.Document {
  sessionId: String;
  contactId: String;
  custId: mongoose.SchemaTypes.ObjectId;
  channelId: String;
  agentId: String;
  groupId: Number;
  priority: Number;
  dateCreateSession: Date;
  datePickupSession: [
    {
      agentId: String;
      date: Date;
    }
  ];
  dateFirstResponse: Date;
  dateEndSession: Date;
  detailCwc: {
    categoryId: Number;
    remark: String;
    feedback: String;
    sentimentId: String;
    dateSubmit: Date;
  };
  ticketId: [String];
  createdAt: Date;
  updatedAt: Date;
}
