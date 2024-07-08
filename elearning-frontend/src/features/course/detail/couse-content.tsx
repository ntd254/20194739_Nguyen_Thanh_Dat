import { CourseDetailDto } from '@/client-sdk';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils/cn';
import { convertSecondToHour } from '@/lib/utils/convert-second';
import { useState } from 'react';
import { MdOutlineOndemandVideo, MdOutlineQuiz } from 'react-icons/md';

type CourseContentProps = {
  course: CourseDetailDto;
};

const CourseContent: React.FC<CourseContentProps> = ({ course }) => {
  const [activeItems, setActiveItems] = useState<string[]>([]);
  const [showAllItems, setShowAllItems] = useState(false);

  const numberOfLectures = course.sections.reduce(
    (acc, section) => acc + section.lessons.length,
    0,
  );

  const { hours, minutes } = convertSecondToHour(course.duration);

  return (
    <div className="mt-9">
      <div className="border-2 bg-muted p-3">
        <h3 className="text-lg font-semibold">Nội dung khóa học</h3>
        <div className="flex items-center justify-between">
          <p>
            {course.sections.length} phần &bull; {numberOfLectures} bài học
            &bull; {hours && `${hours} giờ`} {minutes && `${minutes} phút`} tổng
            thời lượng
          </p>
          <p
            className="cursor-pointer rounded-md px-1 py-2 font-semibold text-primary transition-all hover:bg-slate-50"
            onClick={() => {
              setShowAllItems(!showAllItems);
              if (showAllItems) {
                setActiveItems([]);
                return;
              }
              setActiveItems(course.sections.map((section) => section.id));
            }}
          >
            {showAllItems ? 'Thu gọn' : 'Mở rộng'} tất cả các phần
          </p>
        </div>
      </div>
      <Accordion
        type="multiple"
        value={activeItems}
        onValueChange={(value) => setActiveItems(value)}
      >
        {course.sections.map((section, index) => (
          <AccordionItem
            key={section.id}
            value={section.id}
            className="border-2 border-t-0"
          >
            <AccordionTrigger
              className={cn(
                'justify-between bg-muted px-3',
                activeItems.includes(section.id) && 'border-b-2',
              )}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  {index + 1}
                </div>
                <p className="text-lg">{section.title}</p>
              </div>
            </AccordionTrigger>
            <AccordionContent className="ml-10 space-y-2 p-3">
              {section.lessons.map((lesson) => {
                if (lesson.video) {
                  const { hours, minutes, seconds } = convertSecondToHour(
                    lesson.video.duration,
                  );

                  return (
                    <div key={lesson.id} className="flex items-center gap-2">
                      <MdOutlineOndemandVideo className="text-lg" />
                      <p className="text-base">{lesson.title}</p>
                      <p className="ml-auto text-muted-foreground">
                        {hours && `${hours} giờ`} {minutes && `${minutes} phút`}{' '}
                        {seconds && `${seconds} giây`}
                      </p>
                    </div>
                  );
                }

                return (
                  <div key={lesson.id} className="flex items-center gap-2">
                    <MdOutlineQuiz className="text-lg" />
                    <p className="text-base">Quiz: {lesson.title}</p>
                  </div>
                );
              })}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default CourseContent;
