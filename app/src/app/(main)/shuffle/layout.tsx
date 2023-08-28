import Link from 'next/link';

import * as styles from './layout.css';
import { Button } from '../../_components/button';
import { Header } from '../_components/header';
import { PageLayout } from '../_components/page-layout';

import type { FC, ReactNode } from 'react';

export const metadata = {
  title: 'Shuffle',
  robots: 'noindex',
};

export type ShuffleLayoutProps = {
  children: ReactNode;
  posts: ReactNode;
};

const ShuffleLayout: FC<ShuffleLayoutProps> = ({
  children,
  posts,
}) => {
  return (
    <PageLayout
      header={(
        <Header>
          <Button className={styles.title} variant="ghost" size="medium" borderless asChild>
            <Link href="/shuffle">
              Shuffle
            </Link>
          </Button>
        </Header>
      )}
    >
      <main className={styles.main}>
        {posts}
        {children}
      </main>
    </PageLayout>
  );
};

export default ShuffleLayout;
