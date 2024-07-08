import { FC } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import QuestionField from './question-field';
import { Button } from '@/components/ui/button';
import { FormMessage } from '@/components/ui/form';
import { CourseContentFormValues } from './course-content';

type Props = {
  sectionIndex: number;
  lessonIndex: number;
};

const QuestionFormField: FC<Props> = ({ sectionIndex, lessonIndex }) => {
  const { fields, append, remove } = useFieldArray({
    name: `sections.${sectionIndex}.lessons.${lessonIndex}.questions`,
  });

  const form = useFormContext<CourseContentFormValues>();

  return (
    <div className="ml-5 mt-5 space-y-3">
      {fields.map((field, index) => (
        <QuestionField
          key={field.id}
          lessonIndex={lessonIndex}
          remove={remove}
          sectionIndex={sectionIndex}
          questionIndex={index}
        />
      ))}

      <FormMessage
        path={`sections.${sectionIndex}.lessons.${lessonIndex}.questions.root`}
      />

      <Button
        type="button"
        onClick={() => {
          form.clearErrors(
            `sections.${sectionIndex}.lessons.${lessonIndex}.questions`,
          );
          append({ content: '' });
        }}
      >
        Thêm câu hỏi
      </Button>
    </div>
  );
};

export default QuestionFormField;
