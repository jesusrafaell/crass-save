import mongoose, { Schema } from "mongoose";
import { DriverXCompanyDto } from ".";

const driverXcompanySchema = new Schema<DriverXCompanyDto>(
  {
    companyId: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const DriverXCompanyModel = mongoose.model<DriverXCompanyDto>(
  "driverxcompany",
  driverXcompanySchema
);

export default DriverXCompanyModel;
