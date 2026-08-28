'use client';

import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion, useReducedMotion } from 'motion/react';
import { cn } from '@/lib/utils';

/**
 * ClayButton — tactile primary control. Adopts the clay depth system so it
 * physically compresses on press. Uses `motion/react` for the tap spring;
 * `prefers-reduced-motion` disables the scale animation entirely.
 *
 * Variants:
 *   primary     — emerald filled, main CTA
 *   secondary   — raised ivory clay, neutral action
 *   ghost       — flat, low-emphasis
 *   destructive — soft red, uncommon
 */
const clayButton = cva(
  cn(
    'relative inline-flex items-center justify-center gap-2 font-medium',
    'transition-shadow duration-150 select-none',
    'disabled:cursor-not-allowed disabled:opacity-60',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-bright',
  ),
  {
    variants: {
      variant: {
        primary: cn(
          'bg-primary text-primary-foreground',
          'shadow-clay-raised active:shadow-clay-pressed',
          'hover:bg-primary-bright',
        ),
        secondary: cn(
          'bg-surface-raised text-foreground',
          'shadow-clay-raised active:shadow-clay-pressed',
          'hover:bg-surface',
        ),
        ghost: cn(
          'bg-transparent text-foreground',
          'hover:bg-surface active:shadow-clay-pressed',
        ),
        destructive: cn(
          'bg-destructive text-destructive-foreground',
          'shadow-clay-raised active:shadow-clay-pressed',
        ),
      },
      size: {
        sm: 'h-9  px-4 text-sm rounded-clay-sm',
        md: 'h-11 px-5 text-[15px] rounded-clay-md min-h-[44px]',
        lg: 'h-12 px-6 text-base rounded-clay-lg min-h-[44px]',
      },
      block: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      block: false,
    },
  },
);

export interface ClayButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof clayButton> {
  /** Optional leading icon element. */
  leading?: React.ReactNode;
  /** Optional trailing icon element. */
  trailing?: React.ReactNode;
}

export const ClayButton = forwardRef<HTMLButtonElement, ClayButtonProps>(
  function ClayButton(
    { className, variant, size, block, leading, trailing, children, type = 'button', ...rest },
    ref,
  ) {
    const reduced = useReducedMotion();
    return (
      <motion.button
        ref={ref}
        type={type}
        whileTap={reduced ? undefined : { scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className={cn(clayButton({ variant, size, block }), className)}
        {...(rest as React.ComponentProps<typeof motion.button>)}
      >
        {leading}
        {children}
        {trailing}
      </motion.button>
    );
  },
);

export { clayButton };
