import { DynamicModule, Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { StorageModuleAsyncOptions } from './interfaces/storage-option.interface';
import { STORAGE_OPTIONS } from './storage.constants';

@Module({})
export class StorageModule {
  static forRootAsync(options: StorageModuleAsyncOptions): DynamicModule {
    return {
      module: StorageModule,
      imports: options.imports,
      providers: [
        StorageService,
        {
          provide: STORAGE_OPTIONS,
          useFactory: options.useFactory,
          inject: options.inject,
        },
      ],
      exports: [StorageService],
      global: options.global,
    };
  }
}
