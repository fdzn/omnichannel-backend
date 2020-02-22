import * as mongoose from "mongoose";

export const CustomerSchema = new mongoose.Schema({
  custName: String,
  custGender: String,
  contact: [Object],
  updater: String,
  createdAt: Date,
  updatedAt: Date
});

export interface CustomerInterface extends mongoose.Document {
  custName: String;
  custGender: String;
  contact: [Object];
  updater: String;
  createdAt: Date;
  updatedAt: Date;
}
