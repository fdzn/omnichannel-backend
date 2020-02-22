import * as mongoose from "mongoose";

export const TicketLogSchema = new mongoose.Schema({
  dateLog: Date,
  ticketId: String,
  status: Number,
  notes: String,
  attachment: [Object],
  updater: String,
  unitId: Number,
  duration: Number,
  createdAt: Date,
  updatedAt: Date
});
