import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { toast } from 'sonner';

import { useAlertDialog } from '../components/elements/alert-dialog';
import { Button } from '../components/elements/button';
import { unmuteUser } from '../mutations/user/unmute-user';

import type { User } from '../repositories/user-repository';

type Props = {
  unmuteUserId: User['id'];
  unmuteUserName: User['profile']['name'];
};

export const useUnmuteUser = ({ unmuteUserId, unmuteUserName }: Props) => {
  const router = useRouter();
  const { openAlertDialog } = useAlertDialog();

  const confirm = useCallback(async () => {
    return await openAlertDialog({
      title: `Unmute @${unmuteUserName}`,
      description: `Are you sure you want to unmute @${unmuteUserName}?`,
      acceptButton: <Button variant="primary">OK</Button>,
      rejectButton: <Button>Cancel</Button>,
    });
  }, [openAlertDialog, unmuteUserName]);

  const unmute = useCallback(async () => {
    const result = await unmuteUser(unmuteUserId);
    switch (result.type) {
      case 'success': {
        router.refresh();
        return result.message;
      }
      case 'error': {
        if (result.reason === 'unauthorized') router.push('/login');
        throw new Error(result.message);
      }
    }
  }, [router, unmuteUserId]);

  return useCallback(async () => {
    const isComfirm = await confirm();
    if (!isComfirm) return;

    toast.promise(unmute, {
      loading: 'Unmuting...',
      success: (result: string) => result,
      error: (error: Error) => error.message,
    });
  }, [unmute, confirm]);
};
