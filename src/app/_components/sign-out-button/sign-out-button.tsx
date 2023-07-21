'use client';

import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

import * as styles from './sign-out-button.css';
import { supabase } from '../../_libs/supabase/client-instance';
import { Button } from '../button';

import type { MouseEventHandler, FC } from 'react';

export type SignOutButtonProps = {
  className?: string | undefined;
};

export const SignOutButton: FC<SignOutButtonProps> = ({
  className,
}) => {
  const router = useRouter();
  const onClick = useCallback<MouseEventHandler<HTMLButtonElement>>(async () => {
    const { error: _error } = await supabase.auth.signOut();

    router.refresh();
  }, [router]);

  return (
    <div className={clsx(className, styles.wrapper)}>
      <Button onClick={onClick}>ログアウト</Button>
    </div>
  );
};
