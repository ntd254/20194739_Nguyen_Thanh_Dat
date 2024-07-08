import { Body, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { LoggedInUser } from 'src/common/decorator/logged-in-user.decorator';
import { ApiController } from 'src/common/decorator/api-controller.decorator';
import { CreateAvatarDto } from './dto/req/create-avatar.dto';
import { UpdateProfileDto } from './dto/req/update-profile.dto';
import { DetailParamDto } from 'src/common/base/detail-param.dto';
import { Public } from 'src/common/decorator/public.decorator';
import { PaginationQueryDto } from 'src/common/base/pagination-query.dto';
import { ApiPaginatedResponse } from 'src/common/decorator/paginated-response.decorator';
import { MyLearningCourseDto } from './dto/res/my-learning-course.dto';

@ApiController('users')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  getMe(@LoggedInUser('userId') userId: string) {
    return this.userService.getMe(userId);
  }

  @Get('my-learning-courses')
  @ApiPaginatedResponse(MyLearningCourseDto)
  getMyLearningCourses(
    @LoggedInUser('userId') userId: string,
    @Query() paginationQuery: PaginationQueryDto,
  ) {
    return this.userService.getMyLearningCourses(userId, paginationQuery);
  }

  @Get(':id')
  @Public()
  getUserDetail(@Param() detailParam: DetailParamDto) {
    return this.userService.getUserDetail(detailParam.id);
  }

  @Post('avatar-presigned-url')
  createAvatarPresignedUrl(@Body() createAvatarDto: CreateAvatarDto) {
    return this.userService.createAvatarPresignedUrl(createAvatarDto);
  }

  @Patch('my-profile')
  updateProfile(
    @Body() updateProfileDto: UpdateProfileDto,
    @LoggedInUser('userId') userId: string,
  ) {
    return this.userService.updateMyProfile(updateProfileDto, userId);
  }
}
