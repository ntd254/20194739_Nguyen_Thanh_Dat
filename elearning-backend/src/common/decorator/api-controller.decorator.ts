import { Controller, applyDecorators } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

export function ApiController(prefix?: string) {
  if (prefix) {
    return applyDecorators(Controller(prefix), ApiTags(prefix));
  }
  return applyDecorators(Controller(), ApiTags());
}
