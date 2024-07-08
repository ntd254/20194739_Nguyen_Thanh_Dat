import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaClientOptions } from '@prisma/client/runtime/library';
import { PRISMA_OPTIONS } from './prisma.constant';
import { PrismaModuleOptions } from './interfaces/prisma-option.interface';

@Injectable()
export class PrismaService
  extends PrismaClient<PrismaClientOptions, 'query'>
  implements OnModuleInit
{
  private readonly logger = new Logger(PrismaService.name);

  constructor(
    @Inject(PRISMA_OPTIONS) private readonly options: PrismaModuleOptions,
  ) {
    super(
      options.logging
        ? { log: [{ emit: 'event', level: 'query' }] }
        : undefined,
    );
  }

  async onModuleInit() {
    await this.$connect();
    if (this.options.logging) {
      this.$on('query', (event) => {
        this.logger.log('Query: ' + event.query);
        this.logger.log('Params: ' + event.params);
        this.logger.log('Duration: ' + event.duration + 'ms');
      });
    }
  }
}
