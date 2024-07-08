import { Control, useFieldArray, useFormContext } from 'react-hook-form';
import { CourseContentFormValues } from './course-content';
import { Button } from '@/components/ui/button';
import LessonField from './lesson-field';
import { FormMessage } from '@/components/ui/form';

type LessonFormProps = {
  sectionIndex: number;
  control: Control<CourseContentFormValues>;
};

export default function LessonFormField({
  sectionIndex,
  control,
}: LessonFormProps) {
  const { fields, append, remove } = useFieldArray({
    name: `sections.${sectionIndex}.lessons`,
    control,
  });

  const form = useFormContext<CourseContentFormValues>();

  return (
    <div className="ml-5 mt-5 space-y-3">
      {fields.map((field, index) => (
        <LessonField
          key={field.id}
          lessonIndex={index}
          remove={remove}
          sectionIndex={sectionIndex}
        />
      ))}

      <FormMessage path={`sections.${sectionIndex}.lessons.root`} />

      <Button
        type="button"
        onClick={() => {
          form.clearErrors(`sections.${sectionIndex}.lessons`);
          append({ title: '' });
        }}
      >
        Thêm bài học
      </Button>
    </div>
  );
}
