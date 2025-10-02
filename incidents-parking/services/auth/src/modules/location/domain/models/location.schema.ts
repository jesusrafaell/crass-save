import mongoose, { Schema } from 'mongoose';
import { CoordinatesDto, LocationDto } from './location';

const coordinatesSchema = new Schema<CoordinatesDto>({
  type: {
    type: String,
    default: 'Point',
    enum: ['Point'],
    required: true
  },
  coordinates: {
    type: [Number],
    index: '2dsphere',
    required: true
  },
});

const locationSchema = new Schema<LocationDto>({
  _id: Schema.Types.ObjectId,
  location: coordinatesSchema,
  updatedAt: Number,
  createAt: Number,
  user_id: {
    type: String,
    required: true,
  },
});

const LocationModel = mongoose.model<LocationDto>(
  'userlocation',
  locationSchema
);

export default LocationModel;
