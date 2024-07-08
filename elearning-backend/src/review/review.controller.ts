import { ApiController } from 'src/common/decorator/api-controller.decorator';
import { ReviewService } from './review.service';
import { Get, Param } from '@nestjs/common';
import { DetailParamDto } from 'src/common/base/detail-param.dto';
import { Public } from 'src/common/decorator/public.decorator';

@ApiController('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get(':id')
  @Public()
  getReviewDetail(@Param() detailParam: DetailParamDto) {
    return this.reviewService.getReviewDetail(detailParam.id);
  }
}
