import { ModuleMetadata } from '@nestjs/common';

export interface PrismaModuleOptions {
  logging: boolean;
  global?: boolean;
}

export interface PrismaModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useFactory: (...args: any[]) => PrismaModuleOptions;
  inject: any[];
  global?: boolean;
}
