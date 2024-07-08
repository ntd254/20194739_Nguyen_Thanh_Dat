import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Inject } from '@nestjs/common';
import { STORAGE_OPTIONS } from './storage.constants';
import { StorageModuleOptions } from './interfaces/storage-option.interface';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export class StorageService {
  private s3Client = new S3Client({});
  private bucketName: string;

  constructor(@Inject(STORAGE_OPTIONS) storageOptions: StorageModuleOptions) {
    this.s3Client = new S3Client({
      credentials: {
        accessKeyId: storageOptions.accesskey,
        secretAccessKey: storageOptions.secretKey,
      },
      region: storageOptions.region,
    });
    this.bucketName = storageOptions.bucketName;
  }

  async createUploadPresignedUrl(key: string, expiresIn: number) {
    const command = new PutObjectCommand({ Bucket: this.bucketName, Key: key });
    const preSignedUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn,
    });

    return preSignedUrl;
  }
}
