import { ObjectId } from "mongodb";

export interface Version {
    _id: ObjectId;
    miniOSVersion: string;
    iOSVersion: string;
    minAndroidVersion: number;
    androidVersion: number;
    created_at: number;
    updated_at: number;
}
