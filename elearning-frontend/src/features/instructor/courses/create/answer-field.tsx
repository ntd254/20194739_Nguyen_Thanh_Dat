import { Checkbox } from '@/components/ui/checkbox';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Trash2 } from 'lucide-react';
import { FC } from 'react';

type Props = {
  lessonIndex: number;
  remove: (index: number) => void;
  sectionIndex: number;
  questionIndex: number;
  answerIndex: number;
};

const AnswerField: FC<Props> = ({
  lessonIndex,
  questionIndex,
  remove,
  sectionIndex,
  answerIndex,
}) => {
  return (
    <div className="flex gap-3">
      <FormField
        name={
          `sections.${sectionIndex}.lessons.${lessonIndex}.questions.${questionIndex}.answers.${answerIndex}.isCorrect` as const
        }
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
                className="h-5 w-5"
              />
            </FormControl>
          </FormItem>
        )}
      />
      <div className="group/lesson flex-1 space-y-3 rounded-md border border-zinc-500 p-3">
        <p className="flex items-center py-2 font-semibold">
          Câu trả lời {answerIndex + 1}{' '}
          <span
            className="ml-auto hidden cursor-pointer text-base group-hover/lesson:block"
            onClick={() => remove(answerIndex)}
          >
            <Trash2 />
          </span>
        </p>
        <FormField
          name={
            `sections.${sectionIndex}.lessons.${lessonIndex}.questions.${questionIndex}.answers.${answerIndex}.content` as const
          }
          render={({ field }) => (
            <FormItem>
              <FormLabel>Câu trả lời</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default AnswerField;
