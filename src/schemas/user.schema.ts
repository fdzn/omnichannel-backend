import * as mongoose from "mongoose";

export const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  name: String,
  email: String,
  msisdn: String,
  avatar: Number,
  userlevel: String,
  unitId: Number,
  groupId: Number,
  isLogin: Boolean,
  skillId: Number,
  socketStatus: Number,
  isActive: Boolean,
  pbx: {
    hostId: Number,
    user: String,
    password: String
  },
  updater: String,
  createdAt: Date,
  updatedAt: Date
});
