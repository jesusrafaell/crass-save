import { ObjectId } from "mongodb";
import { LocationRepository } from "../../infrastructure/repository/locationRepository";
import {
  CreateLocalization,
  CoordinatesData,
  LocationDto,
} from "../models/location";
import { nativeCurrentUnixTime } from "../../../../common/utils/unixTime";
import {
  latitudeToKm,
  longitudeToKm,
} from "../../../../common/utils/convertToKm";
import listCodeErrors from "../../../../common/utils/listCodeErrors";

export class LocationService {
  constructor(private readonly locationRepository = new LocationRepository()) {}

  public async getByUserId(userId: string) {
    const localization = await this.locationRepository.getByUserId(userId);
    if (!localization)
      throw new Error(listCodeErrors.localizationNotFound.code);
    return localization;
  }

  public async getById(id: string) {
    try {
      return await this.locationRepository.getById(new ObjectId(id));
    } catch (error) {
      throw new Error("localization not found");
    }
  }

  public async getInRadius(data: CoordinatesData) {
    const radiusInRadians = data.radius / 6371000;
    const userLocations = await this.locationRepository.getInRadius({ ...data, radius: radiusInRadians });
    return userLocations;
  }

  public async create(data: CreateLocalization, userId: string) {
    const exist = await this.locationRepository.getByUserId(userId);

    if (!!exist) {
      throw {
        message: "A location already exists for this user.",
        name: "Error",
        stack: "in LocationService of create method`",
        ok: false,
      };
    } else {
      const date = nativeCurrentUnixTime();
      const locationUser: LocationDto = {
        _id: new ObjectId(),
        location: {
          type: "Point",
          coordinates: [data.userLongitude, data.userLatitude],
        },
        user_id: userId,
        updatedAt: date,
        createAt: date,
      };
      const location = await this.locationRepository.create(locationUser);

      return location;
    }
  }

  public async updateByUser(userId: string, lat: number, lon: number) {
    const location: Partial<LocationDto> = {
      location: {
        type: "Point",
        coordinates: [lon, lat],
      },
      updatedAt: nativeCurrentUnixTime(),
    };

    const locationUpdated = await this.locationRepository.updateByUser(
      userId,
      location
    );

    if (!locationUpdated) {
      throw new Error(
        `location doesn't exists by user: ${userId}, LocationService method updateByUser`
      );
    }

    return { locationUpdated };
  }

  public async delete(userId: string) {
    const locationDeleted = await this.locationRepository.delete(userId);

    if (!locationDeleted) {
      throw new Error(
        `Localization doesn't exists: ${userId}, LocationService method delete`
      );
    }
  }
}
