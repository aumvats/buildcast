'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantStyles: Record<Variant, string> = {
  primary:
    'bg-primary text-white hover:bg-primary-hover active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 shadow-sm hover:shadow',
  secondary:
    'bg-surface text-text-primary border border-border hover:bg-bg hover:border-border active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2',
  ghost:
    'text-text-secondary hover:bg-bg hover:text-text-primary active:scale-[0.98]',
};

const sizeStyles: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm min-h-[36px]',
  md: 'px-4 py-2.5 text-[15px] min-h-[44px]',
  lg: 'px-6 py-3 text-base min-h-[48px]',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className = '', disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center font-medium rounded-md transition-all duration-fast cursor-pointer outline-none
          ${variantStyles[variant]} ${sizeStyles[size]}
          ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}
          ${className}`}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export { Button };
export type { ButtonProps };
