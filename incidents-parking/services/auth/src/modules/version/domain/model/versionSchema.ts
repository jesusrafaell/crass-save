import mongoose, { Schema } from "mongoose";
import { Version } from "./version";

const VersionSchema = new Schema<Version>({
  _id: Schema.Types.ObjectId,
  miniOSVersion: String,
  iOSVersion: String,
  minAndroidVersion: Number,
  androidVersion: Number,
  created_at: Number,
  updated_at: Number,
});

const VersionModel = mongoose.model<Version>("versions", VersionSchema);

export default VersionModel;
