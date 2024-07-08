import { ApiProperty } from '@nestjs/swagger';
import { Course, Department, Status } from '@prisma/client';

export class CourseEntity implements Course {
  id: string;
  title: string;
  description: string;
  price: number;
  @ApiProperty({ enum: Status, enumName: 'Status' })
  status: Status;
  thumbnail: string;
  public: boolean;
  @ApiProperty({ enum: Department, enumName: 'Department' })
  department: Department;
  numberOfStudents: number;
  teacherId: string;
  rate: number;
  sumRating: number;
  totalRating: number;
  duration: number;
  createdAt: Date;
  updatedAt: Date | null;
}
