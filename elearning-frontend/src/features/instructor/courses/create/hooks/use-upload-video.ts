import { CoursesService } from '@/client-sdk';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

export const useUploadVideo = () => {
  const {
    mutate: uploadVideo,
    data,
    isSuccess,
  } = useMutation({
    mutationFn: ({
      video,
      duration,
    }: {
      video: File;
      duration: number;
      handleChangeProgress: (progress: number) => void;
    }) =>
      CoursesService.courseControllerCreateVideoPresignedUrl({
        requestBody: { fileName: video.name, duration },
      }),
    onSuccess: async ({ url }, { video, handleChangeProgress }) => {
      try {
        await axios.put(url, video, {
          onUploadProgress(progressEvent) {
            handleChangeProgress(
              Math.round((progressEvent.loaded * 100) / progressEvent.total!),
            );
          },
        });
      } catch (error) {
        console.error('Error uploading video', error);
      }
    },
  });

  return { uploadVideo, videoId: data?.videoId, isSuccess };
};
