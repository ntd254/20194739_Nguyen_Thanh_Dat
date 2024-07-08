import { FilterCourse } from '@/features/course/list/filter-course';

const getMe = ['getMe'];

const getMyTutorCourse = ['tutor-courses'];

const getCourses = (filter: FilterCourse) => ['courses', filter];

export { getMe, getMyTutorCourse, getCourses };
