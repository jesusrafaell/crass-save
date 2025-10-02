import { DeleteResult, ObjectId, UpdateResult } from "mongodb";
import { LocationDto, CoordinatesData } from "../../domain/models/location";
import LocationModel from "../../domain/models/location.schema";

export class LocationRepository {
  public async create(locationData: LocationDto): Promise<LocationDto> {
    try {
      const location = new LocationModel(locationData);
      return await location.save();
    } catch (error) {
      const _error = error as Error;
      throw new Error(
        `${_error.message} in LocationRepository of create method`
      );
    }
  }

  public async getById(_id: ObjectId): Promise<LocationDto | null> {
    try {
      return await LocationModel.findOne({ _id });
    } catch (error) {
      const _error = error as Error;
      throw new Error(
        `${_error.message} in LocationRepository of getById method`
      );
    }
  }

  public async getByUserId(user_id: string): Promise<LocationDto | null> {
    try {
      return await LocationModel.findOne({ user_id });
    } catch (error) {
      const _error = error as Error;
      throw new Error(
        `${_error.message} in LocationRepository of getByUserId method`
      );
    }
  }

  public async delete(userId: string): Promise<DeleteResult> {
    try {
      return LocationModel.deleteOne({ user_id: userId });
    } catch (error) {
      const _error = error as Error;
      throw new Error(
        `${_error.message} in LocationRepository of delete method`
      );
    }
  }

  public async getInRadius(data: CoordinatesData): Promise<LocationDto[]> {
    try {
      const { latitude, longitude, radius } = data;

      const locations = LocationModel.find({
        location: {
          $geoWithin: {
            $centerSphere: [[longitude, latitude], radius],
          },
        },
      });

      return locations;
    } catch (error) {
      const _error = error as Error;
      throw new Error(
        `${_error.message} in LocationRepository of getInRadius method`
      );
    }
  }

  public async updateByUser(
    user_id: string,
    location: Partial<LocationDto>
  ): Promise<UpdateResult<LocationDto>> {
    try {
      return await LocationModel.updateOne(
        {
          user_id,
        },
        { $set: location }
      );
    } catch (error) {
      const _error = error as Error;
      throw new Error(
        `${_error.message} in LocationRepository of updateByUser method`
      );
    }
  }
}
