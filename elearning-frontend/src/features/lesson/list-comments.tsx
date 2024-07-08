import { FC, useRef } from 'react';
import { useGetComments } from './hooks/use-get-comments';
import { Button } from '@/components/ui/button';
import Comment from './comment';
import { UseFormReturn } from 'react-hook-form';

import { useCreateComment } from './hooks/use-create-comment';
import FormComment, { CreateCommentFormValues } from './form-comment';
import { useCommentDetail } from './hooks/use-comment-detail';
import { useRouter } from 'next/router';
import { useFirstRender } from '@/lib/hooks/use-first-render';

const ListComments: FC = () => {
  const router = useRouter();
  // Prevent the page from flashing because of commentId and replyId
  const { firstRender } = useFirstRender();
  const commentId = router.query.commentId as string | undefined;
  const replyId = router.query.replyId as string | undefined;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetComments();
  const { comment, isError } = useCommentDetail(commentId);
  const { comment: reply, isError: errorReply } = useCommentDetail(replyId);

  const titleRef = useRef<HTMLParagraphElement>(null);

  const { create } = useCreateComment();
  const onSubmit = (
    values: CreateCommentFormValues,
    form: UseFormReturn<CreateCommentFormValues>,
  ) => {
    create(values, {
      onSuccess: () => {
        titleRef.current?.scrollIntoView({ behavior: 'smooth' });
        form.reset();
      },
    });
  };

  if (firstRender) return null;
  if (isError || errorReply) {
    router.push('/404');
  }

  return (
    <div className="mx-auto mt-3 max-w-5xl">
      <p className="mb-3 text-lg font-semibold" ref={titleRef}>
        Hỏi đáp
      </p>

      <div className="space-y-4">
        {!commentId &&
          data?.pages
            .flatMap((page) => page.results)
            .map((comment) => <Comment key={comment.id} comment={comment} />)}
      </div>

      {comment && (
        <Comment
          ref={(element) => element?.scrollIntoView({ behavior: 'smooth' })}
          comment={comment}
          excludeReplyId={replyId}
        />
      )}

      {reply && (
        <div className="ml-[48px] mt-2">
          <Comment comment={reply} />
        </div>
      )}

      {hasNextPage && !commentId && (
        <div className="mt-4 text-center">
          <Button
            loading={isFetchingNextPage}
            variant="outline"
            className="text-base font-medium"
            onClick={() => fetchNextPage()}
          >
            Xem thêm
          </Button>
        </div>
      )}

      {!commentId && (
        <div className="mt-8">
          <FormComment onSubmit={onSubmit} />
        </div>
      )}
    </div>
  );
};

export default ListComments;
