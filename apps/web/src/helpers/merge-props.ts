import { clsx } from 'clsx';

export const mergeProps = <T extends Record<string, unknown>[]>(...props: T) => {
  const property = { ...props.at(0) };

  for (const nextProps of props.slice(1)) {
    for (const [key, value] of Object.entries(nextProps)) {
      const baseValue = property[key];

      if (/^on[A-Z]/.test(key)) {
        property[key] = (...arguments_: unknown[]) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          if (typeof baseValue === 'function') baseValue(...arguments_);
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          if (typeof value === 'function') value(...arguments_);
        };
      }

      if (key === 'style') {
        if (typeof baseValue === 'object' && typeof value === 'object') {
          property[key] = { ...baseValue, ...value };
        } else if (typeof value === 'object') {
          property[key] = value;
        }
      }

      if (key === 'className') {
        if (typeof baseValue === 'string' && typeof value === 'string') {
          property[key] = clsx(baseValue, value);
        } else if (typeof value === 'string') {
          property[key] = value;
        }
      }
    }
  }

  return property;
};
