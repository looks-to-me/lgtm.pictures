import { recipe } from '@vanilla-extract/recipes';

import { theme } from '../../_theme';

export const wrapper = recipe({
  base: {
    display: 'inline-flex',
    cursor: 'pointer',
    border: 'solid 1px',
    borderRadius: theme.radius.medium,
    transitionDuration: theme.duration.normal,
    transitionProperty: 'color, background-color, border-color',
    selectors: {
      '&:disabled': {
        cursor: 'not-allowed',
      },
    },
  },
  variants: {
    variant: {
      normal: {
        color: theme.color.tokens.button.normal.text,
        borderColor: theme.color.tokens.button.normal.border,
        backgroundColor: theme.color.tokens.button.normal.background,
        selectors: {
          '&:hover': {
            color: theme.color.tokens.button.normal.hover.text,
            borderColor: theme.color.tokens.button.normal.hover.border,
            backgroundColor: theme.color.tokens.button.normal.hover.background,
          },
          '&:disabled': {
            color: theme.color.tokens.button.normal.disabled.text,
            borderColor: theme.color.tokens.button.normal.disabled.border,
            backgroundColor: theme.color.tokens.button.normal.disabled.background,
          },
        },
      },
      primary: {
        color: theme.color.tokens.button.primary.text,
        borderColor: theme.color.tokens.button.primary.border,
        backgroundColor: theme.color.tokens.button.primary.background,
        selectors: {
          '&:hover': {
            color: theme.color.tokens.button.primary.hover.text,
            borderColor: theme.color.tokens.button.primary.hover.border,
            backgroundColor: theme.color.tokens.button.primary.hover.background,
          },
          '&:disabled': {
            color: theme.color.tokens.button.primary.disabled.text,
            borderColor: theme.color.tokens.button.primary.disabled.border,
            backgroundColor: theme.color.tokens.button.primary.disabled.background,
          },
        },
      },
      danger: {
        color: theme.color.tokens.button.danger.text,
        borderColor: theme.color.tokens.button.danger.border,
        backgroundColor: theme.color.tokens.button.danger.background,
        selectors: {
          '&:hover': {
            color: theme.color.tokens.button.danger.hover.text,
            borderColor: theme.color.tokens.button.danger.hover.border,
            backgroundColor: theme.color.tokens.button.danger.hover.background,
          },
          '&:disabled': {
            color: theme.color.tokens.button.danger.disabled.text,
            borderColor: theme.color.tokens.button.danger.disabled.border,
            backgroundColor: theme.color.tokens.button.danger.disabled.background,
          },
        },
      },
      ghost: {
        color: theme.color.tokens.button.ghost.text,
        borderColor: theme.color.tokens.button.ghost.border,
        backgroundColor: theme.color.tokens.button.ghost.background,
        selectors: {
          '&:hover': {
            color: theme.color.tokens.button.ghost.hover.text,
            borderColor: theme.color.tokens.button.ghost.hover.border,
            backgroundColor: theme.color.tokens.button.ghost.hover.background,
          },
          '&:disabled': {
            color: theme.color.tokens.button.ghost.disabled.text,
            borderColor: theme.color.tokens.button.ghost.disabled.border,
            backgroundColor: theme.color.tokens.button.ghost.disabled.background,
          },
        },
      },
    },
    borderless: {
      true: {
        borderColor: 'transparent',
        selectors: {
          '&:hover': {
            borderColor: 'transparent',
          },
          '&:disabled': {
            borderColor: 'transparent',
          },
        },
      },
    },
    size: {
      icon: {
        padding: '7px',
      },
      tiny: {
        padding: '3px 8px',
      },
      normal: {
        padding: '5px 8px',
      },
      medium: {
        padding: '7px 12px',
      },
      large: {
        padding: '9px 16px',
      },
    },
  },
});
