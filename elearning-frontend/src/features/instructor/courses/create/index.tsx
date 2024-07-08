import { cn } from '@/lib/utils/cn';
import { Check, Eye, ListVideo, SquarePen } from 'lucide-react';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import GeneralInfoStep from './general-info-step';
import CourseContent from './course-content';
import { parseAsNumberLiteral, parseAsString, useQueryState } from 'nuqs';
import VisibilityStep from './visibility-step';

const steps = [1, 2, 3] as const;
type Step = (typeof steps)[number];

export default function CreateCourseFeature() {
  const [courseId, setCourseId] = useQueryState(
    'courseId',
    parseAsString.withDefault(''),
  );
  const handleChangeCourseId = useCallback(
    (id: string) => setCourseId(id),
    [setCourseId],
  );

  const [activeStep, setActiveStep] = useQueryState(
    'step',
    parseAsNumberLiteral(steps).withDefault(1),
  );
  const handleNextStep = useCallback(() => {
    const nextStep = activeStep + 1;
    if (nextStep === 4) {
      return;
    }
    setActiveStep(nextStep as Step);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [activeStep, setActiveStep]);
  const handlePrevStep = useCallback(() => {
    const prevStep = activeStep - 1;
    if (prevStep === 0) {
      return;
    }
    setActiveStep(prevStep as Step);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [activeStep, setActiveStep]);

  const [stepElement, setStepElement] = useState<ReactNode>(null);
  useEffect(() => {
    switch (activeStep) {
      case 1:
        setStepElement(
          <GeneralInfoStep
            onNextStep={handleNextStep}
            onPrevStep={handlePrevStep}
            onChangeCourseId={handleChangeCourseId}
          />,
        );
        break;
      case 2:
        setStepElement(
          <CourseContent
            onNextStep={handleNextStep}
            onPrevStep={handlePrevStep}
            courseId={courseId}
          />,
        );
        break;
      case 3:
        setStepElement(
          <VisibilityStep
            onNextStep={handleNextStep}
            onPrevStep={handlePrevStep}
            courseId={courseId}
          />,
        );
    }
  }, [
    activeStep,
    courseId,
    handleChangeCourseId,
    handleNextStep,
    handlePrevStep,
  ]);

  return (
    <div className="flex flex-col gap-4">
      <ol className="flex items-center">
        <li
          className={cn(
            "flex w-full items-center gap-1 after:inline-block after:h-1 after:w-full after:border-4 after:border-b after:border-muted after:content-['']",
            activeStep > 1 && 'after:border-blue-200',
          )}
        >
          <span
            className={cn(
              'relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted transition-all duration-200 lg:h-12 lg:w-12',
              activeStep >= 1 && 'bg-primary text-primary-foreground',
            )}
          >
            <Check
              className={cn(
                'absolute opacity-0 transition-all duration-200',
                activeStep > 1 && 'opacity-100',
              )}
            />
            <SquarePen
              className={cn(
                'opacity-100 transition-all duration-200',
                activeStep > 1 && 'opacity-0',
              )}
            />
          </span>
          <span className="whitespace-nowrap text-muted-foreground">
            Thông tin chung
          </span>
        </li>
        <li
          className={cn(
            "flex w-full items-center gap-1 after:inline-block after:h-1 after:w-full after:border-4 after:border-b after:border-muted after:content-['']",
            activeStep > 2 && ' after:border-blue-200',
          )}
        >
          <span
            className={cn(
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted transition-all duration-200 lg:h-12 lg:w-12',
              activeStep >= 2 && 'bg-primary text-primary-foreground',
            )}
          >
            <Check
              className={cn(
                'absolute opacity-0 transition-opacity duration-200',
                activeStep > 2 && 'opacity-100',
              )}
            />
            <ListVideo
              className={cn(
                'opacity-100 transition-opacity duration-200',
                activeStep > 2 && 'opacity-0',
              )}
            />
          </span>
          <span className="whitespace-nowrap text-muted-foreground">
            Nội dung
          </span>
        </li>
        <li className="flex items-center gap-1">
          <span
            className={cn(
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted transition-all duration-200 lg:h-12 lg:w-12',
              activeStep >= 3 && 'bg-primary text-primary-foreground',
            )}
          >
            <Eye />
          </span>
          <span className="whitespace-nowrap text-muted-foreground">
            Chế độ hiển thị
          </span>
        </li>
      </ol>

      <div className="mx-auto w-full max-w-3xl">{stepElement}</div>
    </div>
  );
}
