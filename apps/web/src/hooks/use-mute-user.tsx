import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { toast } from 'sonner';

import { useAlertDialog } from '../components/elements/alert-dialog';
import { Button } from '../components/elements/button';
import { muteUser } from '../mutations/user/mute-user';

import type { User } from '../repositories/user-repository';

type Props = {
  muteUserId: User['id'];
  muteUserName: User['profile']['name'];
};

export const useMuteUser = ({ muteUserId, muteUserName }: Props) => {
  const router = useRouter();
  const { openAlertDialog } = useAlertDialog();

  const confirm = useCallback(async () => {
    return await openAlertDialog({
      title: `Mute @${muteUserName}`,
      description: `Are you sure you want to mute @${muteUserName}?`,
      acceptButton: <Button variant="danger">OK</Button>,
      rejectButton: <Button>Cancel</Button>,
    });
  }, [openAlertDialog, muteUserName]);

  const mute = useCallback(async () => {
    const result = await muteUser(muteUserId);
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
  }, [muteUserId, router]);

  return useCallback(async () => {
    const isComfirm = await confirm();
    if (!isComfirm) return;

    toast.promise(mute, {
      loading: 'Muting...',
      success: (result: string) => result,
      error: (error: Error) => error.message,
    });
  }, [confirm, mute]);
};
