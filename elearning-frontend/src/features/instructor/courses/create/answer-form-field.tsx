import { FC } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import AnswerField from './answer-field';
import { CourseContentFormValues } from './course-content';
import { FormMessage } from '@/components/ui/form';

type Props = {
  sectionIndex: number;
  lessonIndex: number;
  questionIndex: number;
};

const AnswerFormField: FC<Props> = ({
  sectionIndex,
  lessonIndex,
  questionIndex,
}) => {
  const { fields, append, remove } = useFieldArray({
    name: `sections.${sectionIndex}.lessons.${lessonIndex}.questions.${questionIndex}.answers`,
  });

  const form = useFormContext<CourseContentFormValues>();

  return (
    <div className="ml-5 mt-5 space-y-3">
      {fields.map((field, index) => (
        <AnswerField
          key={field.id}
          lessonIndex={lessonIndex}
          remove={remove}
          sectionIndex={sectionIndex}
          questionIndex={questionIndex}
          answerIndex={index}
        />
      ))}

      <FormMessage
        path={`sections.${sectionIndex}.lessons.${lessonIndex}.questions.${questionIndex}.answers.root`}
      />

      <Button
        type="button"
        onClick={() => {
          append({ content: '' });
          form.clearErrors(
            `sections.${sectionIndex}.lessons.${lessonIndex}.questions.${questionIndex}.answers`,
          );
        }}
      >
        Thêm câu trả lời
      </Button>
    </div>
  );
};

export default AnswerFormField;
