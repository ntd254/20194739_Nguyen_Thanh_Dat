import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
} from 'nuqs';
import CourseList from './course-list';
import FilterCourse from './filter-course';
import { Department, OrderCourseBy, PriceFilter, Rating } from '@/client-sdk';

export default function ListCourseFeature() {
  const [filter, setFilter] = useQueryStates({
    keyword: parseAsString.withDefault(''),
    price: parseAsArrayOf(
      parseAsStringEnum(Object.values(PriceFilter)),
    ).withDefault([]),
    department: parseAsArrayOf(
      parseAsStringEnum(Object.values(Department)),
    ).withDefault([]),
    page: parseAsInteger.withDefault(1),
    rating: parseAsStringEnum(Object.values(Rating)),
    duration: parseAsArrayOf(parseAsInteger).withDefault([0, 100]),
    orderBy: parseAsStringEnum(Object.values(OrderCourseBy)).withDefault(
      OrderCourseBy.NUMBER_OF_STUDENTS,
    ),
  });

  const handleChangeFilter = (newFilter: Partial<typeof filter>) => {
    setFilter({ ...newFilter, page: 1 });
  };
  const handleChangePage = (page: number) => {
    setFilter({ page });
  };

  return (
    <div className="flex flex-1 items-start gap-4">
      <FilterCourse filter={filter} onFilterChange={handleChangeFilter} />
      <CourseList
        filter={filter}
        onPageChange={handleChangePage}
        onFilterChange={handleChangeFilter}
      />
    </div>
  );
}
