import { QuestionLessonResDto } from '@/client-sdk';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FC, useRef, useState } from 'react';
import { useCheckAnswer } from './hooks/use-check-answer';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

type Props = {
  question: QuestionLessonResDto;
  order: number;
  lastQuestion: boolean;
  onNextQuestion: () => void;
  onAnswerCorrect: () => void;
  onShowResult: () => void;
  onComplete: () => void;
};

const Question: FC<Props> = ({
  question,
  order,
  lastQuestion,
  onNextQuestion,
  onAnswerCorrect,
  onShowResult,
  onComplete,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string[]>([]);

  const hasAnsweredRef = useRef(false);
  const { checkAnswer, data } = useCheckAnswer();

  return (
    <div className="mt-5">
      <div className="mb-4">
        <p className="font-medium">Câu {order + 1}:</p>
        <p className="whitespace-pre-line text-lg">{question.question}</p>
      </div>

      <div className="flex flex-col gap-3">
        {question.answers.map((answer) => (
          <div
            key={answer.id}
            className="cursor-pointer border p-5 hover:bg-secondary"
            onClick={() => {
              if (selectedAnswer.includes(answer.id)) {
                setSelectedAnswer(
                  selectedAnswer.filter((id) => id !== answer.id),
                );
              } else {
                setSelectedAnswer([...selectedAnswer, answer.id]);
              }
            }}
          >
            <div className="flex items-center space-x-2">
              <Checkbox
                className="h-5 w-5"
                checked={selectedAnswer.includes(answer.id)}
                onCheckedChange={(checked) =>
                  setSelectedAnswer(
                    checked
                      ? [...selectedAnswer, answer.id]
                      : selectedAnswer.filter((id) => id !== answer.id),
                  )
                }
              />
              <label className="cursor-pointer whitespace-pre-line font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {answer.answer}
              </label>
            </div>
          </div>
        ))}
      </div>

      {(!data || !data.isCorrect) && (
        <div className="text-right">
          <Button
            className="mt-3"
            onClick={() => {
              checkAnswer(
                {
                  questionId: question.id,
                  answerIds: selectedAnswer,
                },
                {
                  onSuccess: (data) => {
                    if (data.isCorrect && !hasAnsweredRef.current) {
                      onAnswerCorrect();
                    }
                    hasAnsweredRef.current = true;
                  },
                },
              );
            }}
          >
            Kiểm tra
          </Button>
        </div>
      )}

      {data && data.isCorrect && (
        <div className="text-right">
          <Button
            className="mt-3"
            onClick={() => {
              if (!lastQuestion) {
                onNextQuestion();
              } else {
                onShowResult();
                onComplete();
              }
            }}
          >
            {!lastQuestion ? 'Tiếp tục' : 'Xem kết quả'}
          </Button>
        </div>
      )}

      {data && (
        <div className="mt-3">
          {data.isCorrect ? (
            <div className="flex items-center gap-2 bg-[#acd2cc] p-3 text-lg font-semibold">
              <FaCheckCircle className="h-5 w-5" />
              Chính xác
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-[#fcbca0] p-3 text-lg font-semibold">
              <FaTimesCircle className="h-5 w-5" /> Sai
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Question;
