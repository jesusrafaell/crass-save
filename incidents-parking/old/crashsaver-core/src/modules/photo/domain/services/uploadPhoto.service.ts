import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
} from "@aws-sdk/client-s3";
import { UploadedFile } from "express-fileupload";
import * as path from "path";
import sharp from "sharp";

export class UploadPhotoService {
  private bucketName = process.env.BUCKET_NAME as string;
  private region = process.env.REGION_S3 as string;
  private s3Client = new S3Client({
    region: process.env.REGION_S3 as string,
    credentials: {
      accessKeyId: process.env.ACCESS_KEY_S3 as string,
      secretAccessKey: process.env.SECRET_ACCESS_KEY_S3 as string,
    },
  });

  private async compressPhoto(buffer: Buffer) {
    const photoCompresed = await sharp(buffer).toBuffer();

    return photoCompresed;
  }

  private async createThumbnail(buffer) {
    const thumbnail = await sharp(buffer)
      .resize({
        width: 210,
      })
      .toBuffer();

    return thumbnail;
  }

  public async uploadPhoto(
    userId: string,
    photo: UploadedFile,
  ): Promise<{ url_photo: string; url_thumbnail: string }> {
    try {
      const timestamp = new Date().getTime();
      const fileExtension = path.extname(photo.name).toLowerCase();
      const fileName = `${timestamp}`;
      // const keyPrefix = folderName ? `${folderName}/${timestamp}/` : "";

      const allowedExtensions = [
        ".jpeg",
        ".jpg",
        ".jpe",
        ".jfif",
        ".jfi",
        ".jif",
        ".heif",
        ".heic",
        ".png",
      ];
      if (!allowedExtensions.includes(fileExtension)) {
        throw new Error("InvalidExtension");
      }

      const paramsPhoto: PutObjectCommandInput = {
        Bucket: this.bucketName,
        Key: `${userId}/${fileName}${fileExtension}`,
        Body: await this.compressPhoto(photo.data),
        ACL: "public-read",
        ContentType: photo.mimetype,
      };

      const paramsThumbnail: PutObjectCommandInput = {
        Bucket: process.env.BUCKET_NAME as string,
        Key: `${userId}/${fileName}_thumbnail${fileExtension}`,
        Body: await this.createThumbnail(photo.data),
        ACL: "public-read",
        ContentType: photo.mimetype,
      };

      const commandPhoto = new PutObjectCommand(paramsPhoto);
      const commandThumbnail = new PutObjectCommand(paramsThumbnail);

      const uploadPhoto = await this.s3Client.send(commandPhoto);
      const uploadThumbnail = await this.s3Client.send(commandThumbnail);

      const res = {
        url_photo: `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${paramsPhoto.Key}`,
        url_thumbnail: `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${paramsThumbnail.Key}`,
      };

      return res;
    } catch (error) {
      throw error;
    }
  }
}
