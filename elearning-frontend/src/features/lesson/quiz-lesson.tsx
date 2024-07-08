import { LessonResDto } from '@/client-sdk';
import { Button } from '@/components/ui/button';
import { FC, useCallback, useRef, useState } from 'react';
import Question from './question';
import { useMarkComplete } from './hooks/use-mark-complete';

type Props = {
  lesson: LessonResDto;
};

const QuizLesson: FC<Props> = ({ lesson }) => {
  const [currentQuestion, setCurrentQuestion] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const totalCorrectRef = useRef(0);

  const handleNextQuestion = () =>
    setCurrentQuestion((prev) => (prev as number) + 1);
  const handleAnswerCorrect = useCallback(() => totalCorrectRef.current++, []);
  const handleShowResult = () => setShowResult(true);

  const { markComplete } = useMarkComplete();
  const handleComplete = () => {
    markComplete({ completed: true, score: totalCorrectRef.current });
  };

  return (
    <div className="mx-auto aspect-video max-w-3xl">
      {currentQuestion === null && lesson.score === null && (
        <div className="flex h-full items-center justify-center gap-3">
          <p className="text-lg font-medium">
            Bài kiểm tra gồm: {lesson.questions.length} câu hỏi
          </p>
          <Button onClick={() => setCurrentQuestion(0)}>Bắt đầu</Button>
        </div>
      )}
      {currentQuestion !== null && !showResult && (
        <Question
          key={lesson.questions[currentQuestion].id}
          question={lesson.questions[currentQuestion]}
          order={currentQuestion}
          lastQuestion={currentQuestion === lesson.questions.length - 1}
          onNextQuestion={handleNextQuestion}
          onAnswerCorrect={handleAnswerCorrect}
          onShowResult={handleShowResult}
          onComplete={handleComplete}
        />
      )}
      {showResult && (
        <div className="flex items-center gap-3">
          <p className="text-lg font-medium">
            Số câu trả lời đúng: {totalCorrectRef.current}/
            {lesson.questions.length}
          </p>
          <Button
            onClick={() => {
              setShowResult(false);
              setCurrentQuestion(null);
              totalCorrectRef.current = 0;
            }}
          >
            Làm lại
          </Button>
        </div>
      )}

      {lesson.score !== null && currentQuestion === null && (
        <div className="flex items-center gap-3">
          <p className="text-lg font-medium">
            Số câu trả lời đúng: {lesson.score}/{lesson.questions.length}
          </p>
          <Button
            onClick={() => {
              setCurrentQuestion(0);
              totalCorrectRef.current = 0;
            }}
          >
            Làm lại
          </Button>
        </div>
      )}
    </div>
  );
};

export default QuizLesson;
