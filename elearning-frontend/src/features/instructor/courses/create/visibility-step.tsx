import { Button } from '@/components/ui/button';
import { FC, useState } from 'react';
import { IoEarthOutline } from 'react-icons/io5';
import { Check, Lock } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useUpdateVisibility } from './hooks/use-update-visibility';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ApiError } from '@/client-sdk';
import { useRouter } from 'next/router';
import { useToast } from '@/components/ui/use-toast';

type PublishStepProps = {
  onNextStep: () => void;
  onPrevStep: () => void;
  courseId: string;
};

const VisibilityStep: FC<PublishStepProps> = ({ onNextStep, courseId }) => {
  const [isPublic, setIsPublic] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const update = useUpdateVisibility();
  const handleComplete = () => {
    update(
      { courseId, isVisible: isPublic },
      {
        onError: (error: ApiError) => {
          if (error.status === 503) {
            setOpenModal(true);
          }
        },
        onSuccess: () => {
          toast({ title: 'Nội dung khóa học đã được tạo', variant: 'success' });
          router.push(`/instructor/courses?courseId=${courseId}`);
        },
      },
    );
    onNextStep();
  };

  return (
    <>
      <div className="flex flex-col">
        <h2 className="text-lg font-semibold">Chế độ hiển thị</h2>

        <div className="mt-3">
          <div className="flex items-stretch gap-5">
            <div
              className={cn(
                'flex flex-1 cursor-pointer flex-col items-center justify-center p-5 pb-12 outline outline-2 outline-gray-300 hover:bg-muted',
                !isPublic && 'outline-4 outline-primary',
              )}
              onClick={() => setIsPublic(false)}
            >
              <Lock size={36} className="mx-auto" />
              <p className="text-center text-xl font-medium">Riêng tư</p>
              <p>
                Học viên không thể tìm thấy khóa học, bạn có thể thay đổi sau
              </p>
            </div>

            <div
              className={cn(
                'flex flex-1 cursor-pointer flex-col items-center justify-center p-5 pb-12 outline outline-2 outline-gray-300 hover:bg-muted',
                isPublic && 'outline-4 outline-primary',
              )}
              onClick={() => setIsPublic(true)}
            >
              <IoEarthOutline size={36} className="mx-auto" />
              <p className="text-center text-xl font-medium">Công khai</p>
              <p>Học viên có thể xem và đăng ký khóa học ngay lập tức</p>
            </div>
          </div>
        </div>

        <div className="ml-auto mt-3 space-x-2">
          <Button onClick={handleComplete}>Hoàn tất</Button>
          {/* <Button onClick={onPrevStep} variant="secondary">
            Quay lại
          </Button> */}
        </div>
      </div>

      <Dialog
        open={openModal}
        onOpenChange={(open) => {
          setOpenModal(open);
          if (!open) {
            router.push('/instructor/courses');
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-1 text-lg">
              Khóa học đang được xử lý <Check color="#22bb33" />
            </DialogTitle>
            <DialogDescription className="text-base">
              Chúng tôi sẽ thông báo bạn qua email khi hoàn tất
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VisibilityStep;
