import { CoursesService } from '@/client-sdk';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

export const useUploadThumbnail = () => {
  const {
    mutate: uploadThumbnail,
    data,
    isSuccess,
  } = useMutation({
    mutationFn: ({ thumbnail }: { thumbnail: File; handleError: () => void }) =>
      CoursesService.courseControllerCreateThumbnailPresignedUrl({
        requestBody: { fileName: thumbnail.name },
      }),
    onSuccess: async ({ url }, { thumbnail }) => {
      try {
        await axios.put(url, thumbnail, {
          headers: {
            'Content-Type': thumbnail.type || 'application/octet-stream',
          },
        });
      } catch (error) {
        console.error('Error uploading thumbnail', error);
      }
    },
    onError: (_, { handleError }) => handleError(),
  });

  return { uploadThumbnail, key: data?.key, isSuccess };
};
