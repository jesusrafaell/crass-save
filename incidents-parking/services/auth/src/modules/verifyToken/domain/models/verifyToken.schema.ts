import { VerifyToken } from "./index";
import mongoose, { Schema } from "mongoose";

const verifyTokenSchema = new Schema<VerifyToken>({
  token: String,
  type: {
    type: String,
    enum: ["verifyEmail", "passwordReset", "driverxcompany"],
  },
  userId: {
    type: String,
    required: true,
  },
  companyId: {
    type: String,
    required: false,
  },
  createdAt: Number,
});

const VerifyTokenModel = mongoose.model<VerifyToken>(
  "verifytoken",
  verifyTokenSchema
);

export default VerifyTokenModel;
