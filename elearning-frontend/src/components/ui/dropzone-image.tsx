import { cn } from '@/lib/utils/cn';
import { Pencil, Upload } from 'lucide-react';
import Image from 'next/image';
import { FC, useState } from 'react';
import { useDropzone } from 'react-dropzone';

type Props = {
  onDrop: (acceptedFiles: File[]) => void;
  onCloseImage: () => void;
  defaultImageUrl?: string;
};

const DropzoneImage: FC<Props> = ({
  onDrop,
  onCloseImage,
  defaultImageUrl,
}) => {
  const [image, setImage] = useState<{ file: File; url: string } | null>(null);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop: (acceptedFiles: File[]) => {
      onDrop(acceptedFiles);
      if (acceptedFiles.length !== 0) {
        setImage({
          file: acceptedFiles[0],
          url: URL.createObjectURL(acceptedFiles[0]),
        });
      }
    },
    accept: { 'image/*': ['.png', '.jpeg', '.jpg'] },
    maxFiles: 1,
    multiple: false,
    maxSize: 2 * 1024 * 1024, // 2MB
  });

  return (
    <div className="relative aspect-square w-56 border-2 border-dashed transition-all duration-75 hover:bg-secondary">
      {image || defaultImageUrl ? (
        <>
          <Image
            src={(image?.url || defaultImageUrl)!}
            alt="avatar"
            fill
            className="object-contain"
          />
          <span
            className="absolute right-2 top-2 cursor-pointer rounded-full bg-white p-2 text-black hover:bg-slate-200"
            onClick={() => {
              setImage(null);
              open();
              onCloseImage();
            }}
          >
            <Pencil size={16} />
          </span>
        </>
      ) : (
        <div
          {...getRootProps({
            className: cn(
              'flex w-full text-center gap-4 flex-col items-center justify-center h-full rounded-md p-3 cursor-pointer',
              isDragActive && 'text-primary',
            ),
          })}
        >
          <input type="file" {...getInputProps()} />
          <Upload />

          <div>
            <p>Click hoặc thả ảnh vào đây</p>
            <p
              className={cn(
                'text-xs text-[#6D6D6D]',
                isDragActive && 'text-primary',
              )}
            >
              Kích thước ảnh tối đa 2 MB
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DropzoneImage;
