import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Trash2 } from 'lucide-react';
import { FC, useState } from 'react';
import { LuPlus } from 'react-icons/lu';
import QuestionFormField from './question-form-field';
import VideoFormField from './video-form-field';
import { useFormContext } from 'react-hook-form';
import { CourseContentFormValues } from './course-content';

type Props = {
  lessonIndex: number;
  remove: (index: number) => void;
  sectionIndex: number;
};

const LessonField: FC<Props> = ({ lessonIndex, remove, sectionIndex }) => {
  const [lessonType, setLessonType] = useState<'video' | 'quiz' | null>(null);

  const form = useFormContext<CourseContentFormValues>();

  return (
    <div className="group/lesson space-y-3 rounded-md border border-zinc-500 p-3">
      <p className="flex items-center py-2 font-semibold">
        Bài học {lessonIndex + 1}{' '}
        <span
          className="ml-auto hidden cursor-pointer text-base group-hover/lesson:block"
          onClick={() => remove(lessonIndex)}
        >
          <Trash2 />
        </span>
      </p>
      <FormField
        name={`sections.${sectionIndex}.lessons.${lessonIndex}.title` as const}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tiêu đề</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {lessonType === null && (
        <div className="flex items-center gap-4">
          <div
            className="flex cursor-pointer items-center gap-2 font-medium hover:text-primary"
            onClick={() => {
              setLessonType('video');
              form.clearErrors(
                `sections.${sectionIndex}.lessons.${lessonIndex}`,
              );
            }}
          >
            <LuPlus /> Bài học video
          </div>
          <div
            className="flex cursor-pointer items-center gap-2 font-medium hover:text-primary"
            onClick={() => {
              setLessonType('quiz');
              form.clearErrors(
                `sections.${sectionIndex}.lessons.${lessonIndex}`,
              );
            }}
          >
            <LuPlus /> Bài tập quiz
          </div>
        </div>
      )}

      {lessonType === 'video' && (
        <VideoFormField lessonIndex={lessonIndex} sectionIndex={sectionIndex} />
      )}

      {lessonType === 'quiz' && (
        <QuestionFormField
          sectionIndex={sectionIndex}
          lessonIndex={lessonIndex}
        />
      )}

      <FormMessage
        path={`sections.${sectionIndex}.lessons.${lessonIndex}.root`}
      />
    </div>
  );
};

export default LessonField;
