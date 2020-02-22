import * as mongoose from "mongoose";

export const TicketSchema = new mongoose.Schema({
  ticketId: String,
  sessionId: [String],
  dateCreateTicket: Date,
  detail: {
    actionType: String,
    status: Number,
    notes: String,
    agentCreate: String,
    updater: String,
    unitId: Number
  },
  actionType: String,
  status: Number,
  notes: String,
  unitId: Number,
  agentCreate: String,
  updater: String,
  createdAt: Date,
  updatedAt: Date
});
