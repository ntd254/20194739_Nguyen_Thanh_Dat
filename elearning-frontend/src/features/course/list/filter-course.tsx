import {
  Department,
  OrderCourseBy,
  PriceFilter,
  Rating as RatingEnum,
} from '@/client-sdk';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Rating from '@/components/ui/rating';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { departments } from '@/constants/department';
import { useFirstRender } from '@/lib/hooks/use-first-render';
import { PiCaretUpDown } from 'react-icons/pi';

export type FilterCourse = {
  keyword: string;
  price: PriceFilter[];
  department: Department[];
  page: number;
  rating: RatingEnum | null;
  duration: number[];
  orderBy: OrderCourseBy;
};

type FilterCourseProps = {
  filter: FilterCourse;
  onFilterChange: (filter: Partial<FilterCourse>) => void;
};

export default function FilterCourse({
  filter,
  onFilterChange,
}: FilterCourseProps) {
  const { firstRender } = useFirstRender();

  if (firstRender) {
    return null;
  }

  return (
    <div className="flex w-80 flex-col gap-3">
      <h3 className="text-lg font-semibold">Chọn theo tiêu chí</h3>
      <div>
        <Separator orientation="horizontal" className="mb-1" />
        <Collapsible defaultOpen={true}>
          <div className="flex items-center justify-between space-x-4">
            <h4 className="text-base font-semibold">Giá</h4>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="w-9 p-0">
                <PiCaretUpDown className="h-4 w-4" />
                <span className="sr-only">Toggle</span>
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent>
            <div className="flex items-center gap-3">
              <Checkbox
                className="h-5 w-5"
                id="price-free"
                defaultChecked={filter.price.includes(PriceFilter.FREE)}
                onCheckedChange={(checked) => {
                  onFilterChange({
                    price: checked
                      ? [...filter.price, PriceFilter.FREE]
                      : filter.price.filter((p) => p !== PriceFilter.FREE),
                  });
                }}
              />
              <Label htmlFor="price-free" className="text-base font-normal">
                Miễn phí
              </Label>
            </div>
            <div className="flex items-center gap-3">
              <Checkbox
                className="h-5 w-5"
                id="price-paid"
                defaultChecked={filter.price.includes(PriceFilter.PAID)}
                onCheckedChange={(checked) => {
                  onFilterChange({
                    price: checked
                      ? [...filter.price, PriceFilter.PAID]
                      : filter.price.filter(
                          (price) => price !== PriceFilter.PAID,
                        ),
                  });
                }}
              />
              <Label htmlFor="price-paid" className="text-base font-normal">
                Có trả phí
              </Label>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      <div>
        <Separator orientation="horizontal" className="mb-1" />
        <Collapsible defaultOpen={true}>
          <div className="flex items-center justify-between space-x-4">
            <h4 className="text-base font-semibold">Lĩnh vực</h4>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="w-9 p-0">
                <PiCaretUpDown className="h-4 w-4" />
                <span className="sr-only">Toggle</span>
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent>
            {departments.map((department) => (
              <div key={department.value} className="flex items-center gap-3">
                <Checkbox
                  className="h-5 w-5"
                  id={`department-${department.value}`}
                  defaultChecked={filter.department.includes(department.value)}
                  onCheckedChange={(checked) => {
                    onFilterChange({
                      department: checked
                        ? [...filter.department, department.value]
                        : filter.department.filter(
                            (departmentFilter) =>
                              departmentFilter !== department.value,
                          ),
                    });
                  }}
                />
                <Label
                  htmlFor={`department-${department.value}`}
                  className="text-base font-normal"
                >
                  {department.label}
                </Label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>
      </div>

      <div>
        <Separator orientation="horizontal" className="mb-1" />
        <Collapsible defaultOpen={true}>
          <div className="flex items-center justify-between space-x-4">
            <h4 className="text-base font-semibold">Đánh giá</h4>{' '}
            {filter.rating && (
              <Button
                variant="ghost"
                className="px-2 py-1"
                onClick={() => onFilterChange({ rating: null })}
              >
                Xóa bộ lọc
              </Button>
            )}
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="w-9 p-0">
                <PiCaretUpDown className="h-4 w-4" />
                <span className="sr-only">Toggle</span>
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent>
            <RadioGroup
              key={filter.rating}
              value={filter.rating || undefined}
              onValueChange={(rating: RatingEnum) => {
                onFilterChange({ rating });
              }}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={RatingEnum.FIVE} id="option-one" />
                <Label
                  htmlFor="option-one"
                  className="inline-flex cursor-pointer items-center gap-1 text-base font-normal"
                >
                  <Rating rating={5} /> từ 5.0 trở lên
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={RatingEnum.FOUR} id="option-two" />
                <Label
                  htmlFor="option-two"
                  className="inline-flex cursor-pointer items-center gap-1 text-base font-normal"
                >
                  <Rating rating={4} /> từ 4.0 trở lên
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={RatingEnum.THREE} id="option-three" />
                <Label
                  htmlFor="option-three"
                  className="inline-flex cursor-pointer items-center gap-1 text-base font-normal"
                >
                  <Rating rating={3} /> từ 3.0 trở lên
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={RatingEnum.TWO} id="option-four" />
                <Label
                  htmlFor="option-four"
                  className="inline-flex cursor-pointer items-center gap-1 text-base font-normal"
                >
                  <Rating rating={2} /> từ 2.0 trở lên
                </Label>
              </div>
            </RadioGroup>
          </CollapsibleContent>
        </Collapsible>
      </div>

      <div>
        <Separator orientation="horizontal" className="mb-1" />
        <Collapsible defaultOpen={true}>
          <div className="mb-1 flex items-center justify-between space-x-4">
            <h4 className="text-base font-semibold">Thời lượng video</h4>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="w-9 p-0">
                <PiCaretUpDown className="h-4 w-4" />
                <span className="sr-only">Toggle</span>
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent>
            <Slider
              value={filter.duration}
              onValueChange={(duration) => onFilterChange({ duration })}
              range
              min={0}
              max={100}
              labelThumb="Giờ"
            />
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}
