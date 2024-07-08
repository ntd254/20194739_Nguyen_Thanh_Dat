import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';

import { cn } from '@/lib/utils/cn';

type Props = React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & {
  range?: boolean;
  labelThumb?: string;
};

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  Props
>(({ className, range, labelThumb, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      'relative flex w-full touch-none select-none items-center',
      className,
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
      <SliderPrimitive.Range className="absolute h-full bg-primary" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="relative block h-5 w-5 cursor-pointer rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none disabled:opacity-50">
      <div className="absolute -left-1 top-5 h-full content-center text-center text-sm">
        {props.value?.at(0)} {labelThumb}
      </div>
    </SliderPrimitive.Thumb>
    {range && (
      <SliderPrimitive.Thumb className="relative block h-5 w-5 cursor-pointer rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none disabled:opacity-50">
        <div className="absolute -left-1 top-5 h-full content-center text-center text-sm">
          {props.value?.at(1)} {labelThumb}
        </div>
      </SliderPrimitive.Thumb>
    )}
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
