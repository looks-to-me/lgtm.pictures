import { clsx } from 'clsx';

import * as styles from './application-header.css';
import { AvatarMenu } from '../../../../app/(main)/_components/avatar-menu';
import { LoginButton } from '../../../../app/(main)/_components/login-button';
import { NewPostButton } from '../../../../app/(main)/_components/new-post-button';
import { ApplicationLogo } from '../application-logo';
import { ApplicationNavigation } from '../application-navigation';

import type { User } from '../../../../app/(main)/_repositories/user-repository';
import type { ComponentPropsWithoutRef, FC } from 'react';

export type ApplicationHeaderProps = ComponentPropsWithoutRef<'header'> & {
  user?: User | undefined;
};

export const ApplicationHeader: FC<ApplicationHeaderProps> = ({
  className,
  children,
  user,
  ...props
}) => {
  return (
    <header {...props} className={clsx(className, styles.wrapper)}>
      <ApplicationNavigation />
      <ApplicationLogo className={styles.logo} />
      <div className={styles.container}>
        {children}
      </div>
      <NewPostButton />
      {user ? (
        <AvatarMenu user={user} />
      ) : (
        <LoginButton />
      )}
    </header>
  );
};
