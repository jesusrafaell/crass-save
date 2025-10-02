import { DeleteResult, ObjectId } from "mongodb";
import { UserTruckDto } from "../../domain/models/truck/userTruck";
import UserTruckModel from "../../domain/models/truck/userTruck.schema";

export class UserTruckRepository {
  public async createOrUpdate(
    data: UserTruckDto
  ): Promise<UserTruckDto | null> {
    try {
      const { userId, company, licensePlate, updatedAt } = data;
      const res = await UserTruckModel.findOneAndUpdate(
        { userId },
        {
          $set: {
            licensePlate,
            company: company,
            updatedAt: updatedAt,
          },
        },
        { new: true, upsert: true, includeResultMetadata: true }
      );
      return res.value;
    } catch (error) {
      const _error = error as Error;
      throw new Error(
        `${_error.message} in UserTruckRepository of create method`
      );
    }
  }

  public async getById(_id: ObjectId): Promise<UserTruckDto | null> {
    try {
      return await UserTruckModel.findOne({ _id });
    } catch (error) {
      const _error = error as Error;
      throw new Error(
        `${_error.message} in UserTruckRepository of getById method`
      );
    }
  }

  public async getByUserId(userId: string): Promise<UserTruckDto | null> {
    try {
      return await UserTruckModel.findOne({ userId });
    } catch (error) {
      const _error = error as Error;
      throw new Error(
        `${_error.message} in UserTruckRepository of getByUserId method`
      );
    }
  }

  public async getByLicensePlate(
    licensePlate: string
  ): Promise<UserTruckDto | null> {
    try {
      return await UserTruckModel.findOne({ licensePlate });
    } catch (error) {
      const _error = error as Error;
      throw new Error(
        `${_error.message} in UserTruckRepository of getByLicensePlate method`
      );
    }
  }

  public async deleteByUserId(userId: string): Promise<DeleteResult> {
    try {
      return UserTruckModel.deleteOne({ userId });
    } catch (error) {
      const _error = error as Error;
      throw new Error(
        `${_error.message} in UserTruckRepository of delete method`
      );
    }
  }
}
