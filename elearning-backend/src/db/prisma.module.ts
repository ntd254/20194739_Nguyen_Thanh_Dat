import { DynamicModule, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PRISMA_OPTIONS } from './prisma.constant';
import {
  PrismaModuleAsyncOptions,
  PrismaModuleOptions,
} from './interfaces/prisma-option.interface';

@Module({})
export class PrismaModule {
  static forRoot(options: PrismaModuleOptions): DynamicModule {
    return {
      module: PrismaModule,
      providers: [
        {
          provide: PRISMA_OPTIONS,
          useValue: options,
        },
        PrismaService,
      ],
      exports: [PrismaService],
      global: options.global,
    };
  }

  static forRootAsync(options: PrismaModuleAsyncOptions): DynamicModule {
    return {
      module: PrismaModule,
      imports: options.imports,
      providers: [
        PrismaService,
        {
          provide: PRISMA_OPTIONS,
          useFactory: options.useFactory,
          inject: options.inject,
        },
      ],
      exports: [PrismaService],
      global: options.global,
    };
  }
}
