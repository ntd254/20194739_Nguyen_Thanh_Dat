import { FC, useEffect } from 'react';
import { useSetLessonCookie } from './hooks/use-set-lesson-cookie';
import { LessonResDto } from '@/client-sdk';
import {
  MediaPlayer,
  MediaProvider,
  MediaProviderAdapter,
  MediaTimeUpdateEventDetail,
  isHLSProvider,
} from '@vidstack/react';
import { useThrottledCallback } from 'use-debounce';
import { useMarkComplete } from './hooks/use-mark-complete';
import {
  DefaultVideoLayout,
  defaultLayoutIcons,
} from '@vidstack/react/player/layouts/default';

type Props = {
  lesson: LessonResDto;
};

const VideoLesson: FC<Props> = ({ lesson }) => {
  const { markComplete } = useMarkComplete();

  const { setCookie, isSuccess } = useSetLessonCookie();
  useEffect(() => {
    if (lesson.id) {
      setCookie(lesson.id);
    }
  }, [lesson.id, setCookie]);

  const handleProviderChange = (provider: MediaProviderAdapter | null) => {
    if (isHLSProvider(provider)) {
      provider.config = {
        xhrSetup: (xhr) => {
          // Enable sending cookies with the request
          xhr.withCredentials = true;
        },
      };
    }
  };
  const handleTimeUpdate = useThrottledCallback(
    (e: MediaTimeUpdateEventDetail) => {
      const currentTime = e.currentTime;
      const percentageWatched = (currentTime / lesson.video!.duration) * 100;
      if (!lesson?.hasCompleted && percentageWatched >= 90) {
        markComplete({ completed: true });
      }
    },
    2000,
  );

  return (
    // Set overflow-hidden for avoiding shift layout when change lesson
    <div className="aspect-video w-full overflow-hidden">
      {isSuccess && (
        <MediaPlayer
          src={lesson.url}
          onTimeUpdate={handleTimeUpdate}
          onProviderChange={handleProviderChange}
        >
          <MediaProvider />
          <DefaultVideoLayout icons={defaultLayoutIcons} noScrubGesture />
        </MediaPlayer>
      )}
    </div>
  );
};

export default VideoLesson;
