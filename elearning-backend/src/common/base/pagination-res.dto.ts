import { ApiHideProperty } from '@nestjs/swagger';

export class PaginationResDto<TData> {
  total: number;

  limit: number;

  page: number;

  // Workaround for Swagger not showing the correct type, add type by using ApiPaginatedResponse decorator
  @ApiHideProperty()
  results: TData[];
}
