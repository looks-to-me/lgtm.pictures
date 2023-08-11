import { toast } from 'sonner';

import { Toaster } from './toaster';
import { Button } from '../button';

import type { Meta, StoryObj } from '@storybook/react';

export default {
  component: Toaster,
} as Meta<typeof Toaster>;

type Story = StoryObj<typeof Toaster>;

export const Default = {
  render: () => {
    const show = () => {
      toast('Title', { description: 'description' });
    };

    return (
      <Button onClick={show}>Show</Button>
    );
  },
} satisfies Story;

export const Success = {
  render: () => {
    const show = () => {
      toast.success('Title', { description: 'description' });
    };

    return (
      <Button onClick={show}>Show</Button>
    );
  },
} satisfies Story;

export const Error = {
  render: () => {
    const show = () => {
      toast.error('Title', { description: 'description' });
    };

    return (
      <Button onClick={show}>Show</Button>
    );
  },
} satisfies Story;

export const Async = {
  render: () => {
    const show = (promise: () => Promise<void>) => {
      toast.promise(promise, {
        loading: 'Loading...',
        success: 'Success',
        error: 'Error',
      });
    };

    const success = () => {
      const promise = () => new Promise<void>(resolve => setTimeout(resolve, 2000));
      show(promise);
    };

    const error = () => {
      const promise = () => new Promise<void>((_, reject) => setTimeout(reject, 2000));
      show(promise);
    };

    return (
      <>
        <Button onClick={success}>Success</Button>
        <Button onClick={error}>Error</Button>
      </>
    );
  },
} satisfies Story;
