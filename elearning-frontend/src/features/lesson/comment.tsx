import { GetCommentsResDto } from '@/client-sdk';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { timeFromNow } from '@/lib/utils/time-from-now';
import { forwardRef, useMemo, useState } from 'react';
import { FaReply } from 'react-icons/fa';
import { useGetReplies } from './hooks/use-get-replies';
import FormComment, { CreateCommentFormValues } from './form-comment';
import { useCreateComment } from './hooks/use-create-comment';
import { cn } from '@/lib/utils/cn';
import { BiSolidUpvote } from 'react-icons/bi';
import { useLogInUser } from '@/lib/hooks/use-log-in-user';
import { useVoteComment } from './hooks/use-vote-comment';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';

type Props = {
  comment: GetCommentsResDto;
  excludeReplyId?: string;
};

const Comment = forwardRef<HTMLDivElement, Props>(
  ({ comment, excludeReplyId }, ref) => {
    const [showReplies, setShowReplies] = useState(false);
    const [showReplyForm, setShowReplyForm] = useState(false);
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
      useGetReplies(comment.id, showReplies || showReplyForm);

    const { create } = useCreateComment();
    const onSubmit = (data: CreateCommentFormValues) => {
      create(
        { content: data.content, parentId: comment.id },
        { onSuccess: () => setShowReplyForm(false) },
      );
    };

    const { user } = useLogInUser();
    const hasVote = useMemo(() => {
      return user?.userCommentVotes.some(
        (vote) => vote.commentId === comment.id,
      );
    }, [user?.userCommentVotes, comment.id]);
    const { upvote } = useVoteComment();
    const lessonId = useRouter().query.lessonId as string;
    const queryClient = useQueryClient();

    return (
      <div ref={ref}>
        <div className="flex items-start gap-2">
          <Avatar>
            <AvatarImage src={comment.user.avatar || undefined} />
            <AvatarFallback>Avatar</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="border">
              <p className="flex w-full items-center gap-2 border-b-2 bg-slate-50 p-3">
                <span className="font-medium">{comment.user.name}</span>
                <span className="text-muted-foreground">
                  {timeFromNow(comment.createdAt)}
                </span>
                <span className="ml-auto flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    {Boolean(comment.numberOfVotes) && comment.numberOfVotes}
                    <BiSolidUpvote
                      className={cn(
                        'cursor-pointer',
                        hasVote && 'text-primary',
                      )}
                      onClick={() => {
                        upvote(
                          { vote: !hasVote, commentId: comment.id },
                          {
                            onSuccess: () => {
                              queryClient.invalidateQueries({
                                queryKey: ['comments', lessonId],
                              });
                              queryClient.invalidateQueries({
                                queryKey: [
                                  'replies',
                                  lessonId,
                                  comment.parentId,
                                ],
                              });
                            },
                          },
                        );
                      }}
                    />
                  </span>
                  <FaReply
                    className={cn(
                      'cursor-pointer',
                      showReplyForm && 'text-primary',
                    )}
                    onClick={() => {
                      setShowReplyForm(!showReplyForm);
                      setShowReplies(true);
                    }}
                  />
                </span>
              </p>
              <p className="p-3">{comment.content}</p>
            </div>
            {comment && comment.numberOfReplies > 0 && !showReplies && (
              <Button
                onClick={() => setShowReplies(true)}
                variant="link"
                className="pl-0 text-base font-medium"
              >
                Xem thêm {comment.numberOfReplies} trả lời
              </Button>
            )}
          </div>
        </div>
        {(showReplies || showReplyForm) && (
          <div className="ml-[48px] mt-2">
            {showReplies && (
              <>
                {hasNextPage && (
                  <div>
                    <Button
                      loading={isFetchingNextPage}
                      variant="link"
                      className="pl-0 pt-0 text-base font-medium"
                      onClick={() => fetchNextPage()}
                    >
                      Xem thêm trả lời
                    </Button>
                  </div>
                )}
                <div className="flex flex-col-reverse gap-2">
                  {data?.pages
                    .flatMap((page) => page.results)
                    .filter((reply) => reply.id !== excludeReplyId)
                    .map((comment) => (
                      <Comment key={comment.id} comment={comment} />
                    ))}
                </div>
              </>
            )}
            {showReplyForm && (
              <div className="mt-4">
                <FormComment onSubmit={onSubmit} />
              </div>
            )}
          </div>
        )}
      </div>
    );
  },
);

Comment.displayName = 'Comment';

export default Comment;
