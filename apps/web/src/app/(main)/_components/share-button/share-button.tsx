'use client';

import { useCallback } from 'react';
import { toast } from 'sonner';

import { Button, ButtonIcon } from '../../../../components/elements/button';
import CopyIcon from '../../../../icons/copy.svg';

import type { FC } from 'react';

export type ShareButtonProps = {
  className?: string | undefined;
  text: string;
};

export const ShareButton: FC<ShareButtonProps> = ({
  className,
  text,
}) => {
  const handleClick = useCallback(() => {
    void navigator.clipboard.writeText(text);
    toast.success('Copied!');
  }, [text]);

  return (
    <Button
      className={className}
      variant="primary"
      size="medium"
      onClick={handleClick}
    >
      <ButtonIcon>
        <CopyIcon />
      </ButtonIcon>
      Copy
    </Button>
  );
};
