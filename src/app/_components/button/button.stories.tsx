import { Button } from './button';

import type { Meta, StoryObj } from '@storybook/react';

export default {
  component: Button,
} as Meta<typeof Button>;

type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: 'Button',
  },
};

export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true,
  },
};

export const Primary: Story = {
  args: {
    ...Default.args,
    variant: 'primary',
  },
};

export const Danger: Story = {
  args: {
    ...Default.args,
    variant: 'danger',
  },
};

export const Ghost: Story = {
  args: {
    ...Default.args,
    variant: 'ghost',
  },
};

export const Borderless: Story = {
  args: {
    ...Default.args,
    borderless: true,
  },
};

export const Icon: Story = {
  args: {
    ...Default.args,
    children: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="1em" height="1em" fill="currentColor">
        <path d="m249-207-42-42 231-231-231-231 42-42 231 231 231-231 42 42-231 231 231 231-42 42-231-231-231 231Z"/>
      </svg>
    ),
    size: 'icon',
  },
};

export const Tiny: Story = {
  args: {
    ...Default.args,
    size: 'tiny',
  },
};

export const Medium: Story = {
  args: {
    ...Default.args,
    size: 'medium',
  },
};

export const Large: Story = {
  args: {
    ...Default.args,
    size: 'large',
  },
};
