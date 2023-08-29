import clsx from 'clsx';

import * as styles from './page-header.css';
import { AvatarMenu } from '../avatar-menu';
import { GlobalNavigation } from '../global-navigation';
import { LoginButton } from '../login-button';
import { Logo } from '../logo';
import { NewPostButton } from '../new-post-button';

import type { UserMetadata } from '../../../_libs/auth/type/user-metadata';
import type { ComponentPropsWithoutRef, FC } from 'react';

export type HeaderPresenterProps = ComponentPropsWithoutRef<'header'> & {
  userMetadata?: UserMetadata | undefined;
};

export const PageHeaderPresenter: FC<HeaderPresenterProps> = ({
  className,
  children,
  userMetadata,
  ...props
}) => {
  return (
    <header {...props} className={clsx(className, styles.wrapper)}>
      <GlobalNavigation />
      <Logo className={styles.logo} />
      <div className={styles.container}>
        {children}
      </div>
      <NewPostButton />
      {userMetadata ? (
        <AvatarMenu userMetadata={userMetadata} />
      ) : (
        <LoginButton />
      )}
    </header>
  );
};
