import clsx from 'clsx';

import * as styles from './post-list.css';
import { InfiniteScroll } from '../../../../../_components/infinite-scroll';

import type { InfiniteScrollFetcher , InfiniteScrollEdge } from '../../../../../_components/infinite-scroll';
import type { ComponentPropsWithoutRef , FC } from 'react';

export type PostListPresenterProps = ComponentPropsWithoutRef<'div'> & {
  posts: InfiniteScrollEdge[];
  fetcher: InfiniteScrollFetcher;
};

export const PostListPresenter: FC<PostListPresenterProps> = ({
  className,
  posts,
  fetcher,
  ...props
}) => {
  return (
    <InfiniteScroll
      {...props}
      className={clsx(className, styles.wrapper)}
      edges={posts}
      fetcher={fetcher}
    />
  );
};
