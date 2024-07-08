import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MediaPlayer, MediaProvider } from '@vidstack/react';
import {
  DefaultVideoLayout,
  defaultLayoutIcons,
} from '@vidstack/react/player/layouts/default';
import { ChangeEvent, useEffect, useState } from 'react';
import { useUploadVideo } from './hooks/use-upload-video';
import { useFormContext } from 'react-hook-form';
import { CourseContentFormValues } from './course-content';

type VideoFieldProps = {
  sectionIndex: number;
  lessonIndex: number;
};

export default function VideoFormField({
  sectionIndex,
  lessonIndex,
}: VideoFieldProps) {
  const form = useFormContext<CourseContentFormValues>();

  const [video, setVideo] = useState<{
    videoFile: File;
    videoUrl: string;
    videoType: string;
    duration: number;
  } | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { uploadVideo, videoId, isSuccess } = useUploadVideo();

  const handleChangeVideo = (e: ChangeEvent<HTMLInputElement>) => {
    const videoFile = e.target.files?.[0];

    if (videoFile) {
      if (videoFile.size > 100 * 1024 * 1024) {
        form.setError(
          `sections.${sectionIndex}.lessons.${lessonIndex}.videoId`,
          { message: 'File size must be less than 100MB' },
        );
        return;
      }

      const videoElement = document.createElement('video');
      videoElement.preload = 'metadata';
      videoElement.src = URL.createObjectURL(videoFile);
      videoElement.onloadedmetadata = () => {
        const duration = videoElement.duration;
        uploadVideo({
          video: videoFile,
          duration,
          handleChangeProgress: (progress: number) =>
            setUploadProgress(progress),
        });
        setVideo({
          videoFile,
          videoUrl: videoElement.src,
          videoType: videoFile.type,
          duration,
        });
      };
    }
  };

  useEffect(() => {
    if (isSuccess && videoId) {
      form.clearErrors(
        `sections.${sectionIndex}.lessons.${lessonIndex}.videoId`,
      );
      form.setValue(
        `sections.${sectionIndex}.lessons.${lessonIndex}.videoId`,
        videoId,
      );
      form.setValue(
        `sections.${sectionIndex}.lessons.${lessonIndex}.duration`,
        video?.duration,
      );
    }
  }, [isSuccess, videoId, form, sectionIndex, lessonIndex, video]);

  return (
    <FormField
      name={`sections.${sectionIndex}.lessons.${lessonIndex}.videoId` as const}
      render={({ field }) =>
        video ? (
          <div className="flex flex-col">
            <div className="aspect-video w-full">
              <MediaPlayer src={{ src: video.videoUrl, type: video.videoType }}>
                <MediaProvider />
                <DefaultVideoLayout icons={defaultLayoutIcons} noScrubGesture />
              </MediaPlayer>
            </div>
            <div>
              <div className="mb-1 flex justify-between">
                <span className="text-base font-medium text-blue-700">
                  {video.videoFile.name}
                </span>
                <span className="text-sm font-medium text-blue-700">
                  {uploadProgress}%
                </span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-gray-200">
                <div
                  className="h-2.5 rounded-full bg-blue-600"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          </div>
        ) : (
          <FormItem>
            <FormLabel className="flex aspect-video w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pb-6 pt-5">
                <svg
                  className="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload video</span>
                </p>
                <p className="text-xs text-gray-500">MP4, MOV, OGG</p>
              </div>
            </FormLabel>
            <FormControl>
              <Input
                className="hidden"
                type="file"
                accept="video/*"
                {...field}
                onChange={handleChangeVideo}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )
      }
    />
  );
}
