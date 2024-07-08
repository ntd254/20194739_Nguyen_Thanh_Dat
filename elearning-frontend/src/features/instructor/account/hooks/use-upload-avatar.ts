import { UsersService } from '@/client-sdk';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

export const useUploadAvatar = () => {
  const {
    mutate: upload,
    data,
    isSuccess,
  } = useMutation({
    mutationFn: (file: File) =>
      UsersService.userControllerCreateAvatarPresignedUrl({
        requestBody: { fileName: file.name },
      }),
    onSuccess: async ({ url }, file) => {
      try {
        await axios.put(url, file, {
          headers: {
            'Content-Type': file.type || 'application/octet-stream',
          },
        });
      } catch (error) {
        console.error('Error uploading avatar', error);
      }
    },
  });

  return { upload, value: data?.value, isSuccess };
};
