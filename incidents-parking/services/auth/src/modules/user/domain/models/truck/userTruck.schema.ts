import mongoose, { Schema } from "mongoose";
import { UserTruckDto } from "./userTruck";

const userTruckSchema = new Schema<UserTruckDto>({
  _id: Schema.Types.ObjectId,
  userId: {
    type: String,
    required: true,
  },
  licensePlate: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: false,
  },
  updatedAt: Number,
});

const UserTruckModel = mongoose.model<UserTruckDto>(
  "usertruck",
  userTruckSchema
);

export default UserTruckModel;
