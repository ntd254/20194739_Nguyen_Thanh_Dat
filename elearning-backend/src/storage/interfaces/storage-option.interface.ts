import { ModuleMetadata } from '@nestjs/common';

export interface StorageModuleOptions {
  bucketName: string;
  region: string;
  secretKey: string;
  accesskey: string;
  global?: boolean;
}

export interface StorageModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useFactory: (...args: any[]) => StorageModuleOptions;
  inject: any[];
  global?: boolean;
}
