import { getYear } from 'date-fns';
import { CircleDotIcon, HomeIcon, MenuIcon, ShuffleIcon } from 'lucide-react';
import Link from 'next/link';

import * as styles from './application-navigation.css';
import { AccessibleIcon } from '../../../elements/accessible-icon';
import { Button, ButtonIcon } from '../../../elements/button';
import { Sheet, SheetContent, SheetSection, SheetTitle, SheetTrigger } from '../../../elements/sheet';
import { VisuallyHidden } from '../../../elements/visually-hidden';
import { GithubIcon } from '../../../icons/github-icon';
import { StorybookIcon } from '../../../icons/storybook-icon';
import { ApplicationLogo } from '../application-logo';

import type { FC } from 'react';

export type ApplicationNavigationProps = {
  className?: string | undefined;
};

export const ApplicationNavigation: FC<ApplicationNavigationProps> = ({
  className,
}) => {
  return (
    <Sheet>
      <SheetTrigger>
        <Button className={className} size="icon">
          <ButtonIcon>
            <AccessibleIcon label="Open global navigation">
              <MenuIcon />
            </AccessibleIcon>
          </ButtonIcon>
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetSection className={styles.main}>
          <VisuallyHidden>
            <SheetTitle>
              Global navigation
            </SheetTitle>
          </VisuallyHidden>
          <ApplicationLogo className={styles.logo} />
          <Button variant="ghost" size="medium" borderless asChild>
            <Link href="/">
              <ButtonIcon>
                <HomeIcon />
              </ButtonIcon>
              Home
            </Link>
          </Button>
          <Button variant="ghost" size="medium" borderless asChild>
            <Link href="/shuffle">
              <ButtonIcon>
                <ShuffleIcon />
              </ButtonIcon>
              Shuffle
            </Link>
          </Button>
        </SheetSection>
        <SheetSection>
          <Button variant="ghost" size="medium" borderless asChild>
            <a href="https://github.com/looks-to-me/looks-to-me" target="_blank">
              <ButtonIcon>
                <GithubIcon />
              </ButtonIcon>
              GitHub Repository
            </a>
          </Button>
          <Button variant="ghost" size="medium" borderless asChild>
            <a href="/storybook" target="_blank">
              <ButtonIcon>
                <StorybookIcon />
              </ButtonIcon>
              Storybook
            </a>
          </Button>
          <Button variant="ghost" size="medium" borderless asChild>
            <a href="https://github.com/looks-to-me/looks-to-me/issues" target="_blank">
              <ButtonIcon>
                <CircleDotIcon />
              </ButtonIcon>
              Bug reports or feature requests
            </a>
          </Button>
          <div className={styles.footer}>
            <small className={styles.copyright}>
              © {getYear(new Date())} PrAha, Inc.
            </small>
            <div className={styles.links}>
              <Link href="/privacy">Privacy Policy</Link>
              <Link href="/terms">Terms Of Use</Link>
            </div>
            <div className={styles.links}>
              <a href="https://www.praha-inc.com/" target="_blank">PrAha</a>
              <a href="https://tech.agaroot.co.jp/" target="_blank">AGAROOT TECHNOLOGIES</a>
            </div>
          </div>
        </SheetSection>
      </SheetContent>
    </Sheet>
  );
};
