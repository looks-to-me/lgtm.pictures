import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { toast } from 'sonner';

import { useAlertDialog } from '../../../../../components/elements/alert-dialog';
import { Button } from '../../../../../components/elements/button';
import { deletePostAction } from '../actions/delete-post';

import type { Post } from '../../../../../repositories/post-repository';

export const useDeletePost = (post: Post) => {
  const router = useRouter();
  const { openAlertDialog } = useAlertDialog();

  return useCallback(async () => {
    const isComfirm = await openAlertDialog({
      title: 'Delete Post',
      description: 'Are you sure you want to delete this post?',
      acceptButton: <Button variant="danger">OK</Button>,
      rejectButton: <Button>Cancel</Button>,
    });
    if (!isComfirm) return;

    toast.promise(async () => {
      const result = await deletePostAction(post.id);
      switch (result.type) {
        case 'success': {
          router.push(result.redirectUrl);
          return result.message;
        }
        case 'error': {
          if (result.reason === 'unauthorized') router.push('/login');
          throw new Error(result.message);
        }
      }
    }, {
      loading: 'Deleting...',
      success: (result: string) => result,
      error: (error: Error) => error.message,
    });
  }, [openAlertDialog, post.id, router]);
};
