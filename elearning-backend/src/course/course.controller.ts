import { Body, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CourseService } from './course.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { LoggedInUser } from 'src/common/decorator/logged-in-user.decorator';
import { CreateCourseDto } from './dto/req/create-course.dto';
import { CreateThumbnailDto } from './dto/req/create-thumbnail.dto';
import { CreateCourseContentDto } from './dto/req/create-course-content.dto';
import { CreateVideoDto } from './dto/req/create-video.dto';
import { GetCourseFilterDto } from './dto/req/get-course-filter.dto';
import { ApiPaginatedResponse } from 'src/common/decorator/paginated-response.decorator';
import { CourseDto } from './dto/res/course.dto';
import { GetCourseDetailDto } from './dto/req/get-course-detail.dto';
import { SearchCoursesDto } from './dto/req/search-courses.dto';
import { ApiController } from 'src/common/decorator/api-controller.decorator';
import { Public } from 'src/common/decorator/public.decorator';
import { PaginationQueryDto } from 'src/common/base/pagination-query.dto';
import { GetReviewsDto } from './dto/res/get-reviews.dto';
import { UpdateCourseVisibilityDto } from './dto/req/update-course-visibility.dto';
import { DetailParamDto } from 'src/common/base/detail-param.dto';

@ApiController('courses')
@ApiBearerAuth()
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Get('search')
  @Public()
  searchCourses(@Query() searchCoursesDto: SearchCoursesDto) {
    return this.courseService.searchCourses(searchCoursesDto);
  }

  @Get()
  @Public()
  @ApiPaginatedResponse(CourseDto)
  getCourses(@Query() filter: GetCourseFilterDto) {
    return this.courseService.getCourses(filter);
  }

  @Get('my-tutor-courses')
  getMyTutorCourse(@LoggedInUser('userId') userId: string) {
    return this.courseService.getMyTutorCourse(userId);
  }

  @Get('complete-convert-video')
  completeConvertVideo(@Query('objectId') objectId: string) {
    return this.courseService.completeConvertVideo(objectId);
  }

  @Get(':courseId')
  @Public()
  getCourseDetail(@Param() getCourseDetailDto: GetCourseDetailDto) {
    return this.courseService.getCourseDetail(getCourseDetailDto);
  }

  @Get(':courseId/reviews')
  @ApiPaginatedResponse(GetReviewsDto)
  @Public()
  getCourseReview(
    @Param() getCourseDetailDto: GetCourseDetailDto,
    @Query() filter: PaginationQueryDto,
  ) {
    return this.courseService.getCourseReview(getCourseDetailDto, filter);
  }

  @Post('my-courses')
  createMyCourse(
    @LoggedInUser('userId') userId: string,
    @Body() createCourseDto: CreateCourseDto,
  ) {
    return this.courseService.createMyCourse(userId, createCourseDto);
  }

  @Post('enroll-free-course')
  enrollFreeCourse(
    @LoggedInUser('userId') userId: string,
    @Body() detailDto: DetailParamDto,
  ) {
    return this.courseService.enrollFreeCourse(userId, detailDto.id);
  }

  @Post('course-content')
  createCourseContent(@Body() createCourseContentDto: CreateCourseContentDto) {
    return this.courseService.createCourseContent(createCourseContentDto);
  }

  @Post('video-presigned-url')
  createVideoPresignedUrl(@Body() createVideoDto: CreateVideoDto) {
    return this.courseService.createVideoPresignedUrl(createVideoDto);
  }

  @Post('thumbnail-presigned-url')
  createThumbnailPresignedUrl(@Body() createThumbnailDto: CreateThumbnailDto) {
    return this.courseService.createThumbnailPresignedUrl(createThumbnailDto);
  }

  @Patch('course-visibility')
  updateCourseVisibility(
    @Body() updateCourseVisibilityDto: UpdateCourseVisibilityDto,
  ) {
    return this.courseService.updateCourseVisibility(updateCourseVisibilityDto);
  }
}
