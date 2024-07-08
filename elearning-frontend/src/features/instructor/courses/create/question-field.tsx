import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Trash2 } from 'lucide-react';
import { FC } from 'react';
import AnswerFormField from './answer-form-field';
import { Textarea } from '@/components/ui/textarea';

type Props = {
  lessonIndex: number;
  remove: (index: number) => void;
  sectionIndex: number;
  questionIndex: number;
};

const QuestionField: FC<Props> = ({
  lessonIndex,
  questionIndex,
  remove,
  sectionIndex,
}) => {
  return (
    <div className="group/lesson space-y-3 rounded-md border border-zinc-500 p-3">
      <p className="flex items-center py-2 font-semibold">
        Câu hỏi {questionIndex + 1}{' '}
        <span
          className="ml-auto hidden cursor-pointer text-base group-hover/lesson:block"
          onClick={() => remove(questionIndex)}
        >
          <Trash2 />
        </span>
      </p>
      <FormField
        name={
          `sections.${sectionIndex}.lessons.${lessonIndex}.questions.${questionIndex}.content` as const
        }
        render={({ field }) => (
          <FormItem>
            <FormLabel>Câu hỏi</FormLabel>
            <FormControl>
              <Textarea {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <AnswerFormField
        lessonIndex={lessonIndex}
        questionIndex={questionIndex}
        sectionIndex={sectionIndex}
      />
    </div>
  );
};

export default QuestionField;
