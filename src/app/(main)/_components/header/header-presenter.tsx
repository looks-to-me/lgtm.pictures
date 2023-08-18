import clsx from 'clsx';
import Image from 'next/image';

import * as styles from './header.css';
import { Button } from '../../../_components/button';
import { Dialog } from '../../../_components/dialog';
import { DialogContent } from '../../../_components/dialog/dialog-content';
import { DialogTrigger } from '../../../_components/dialog/dialog-trigger';
import { Popover, PopoverContent, PopoverTrigger } from '../../../_components/popover';
import { GitHubLoginButton } from '../github-login-button';
import { GlobalNavigation } from '../global-navigation';
import { Logo } from '../logo';
import { LogoutButton } from '../logout-button';

import type { AuthUser } from '../../../_libs/auth/type/auth-user';
import type { ComponentPropsWithoutRef, FC } from 'react';

export type HeaderPresenterProps = ComponentPropsWithoutRef<'header'> & {
  authUser?: AuthUser | undefined;
};

export const HeaderPresenter: FC<HeaderPresenterProps> = ({
  className,
  children,
  authUser,
  ...props
}) => {
  return (
    <header {...props} className={clsx(className, styles.wrapper)}>
      <GlobalNavigation />
      <Logo />
      <div className={styles.container}>
        {children}
      </div>
      <Popover>
        <PopoverTrigger>
          {
            authUser
              ? (
                <Image
                  src={authUser.avatarUrl}
                  alt={authUser.displayName ?? authUser.id}
                  width={32}
                  height={32}
                  className={styles.userAvatar}
                />
              )
              : (
                <Dialog>
                  <DialogTrigger>
                    <Button>ログイン</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <GitHubLoginButton />
                  </DialogContent>
                </Dialog>
              )
          }
        </PopoverTrigger>
        {authUser && (
          <PopoverContent>
            <div className={styles.popover}>
              <div className={styles.accountInfoArea}>
                <p className={styles.accountName}>{authUser.accountName}</p>
                <p className={styles.displayName}>{authUser.displayName}</p>
              </div>
              <div>
                <LogoutButton size="medium" />
              </div>
            </div>
          </PopoverContent>
        )}
      </Popover>
    </header>
  );
};
