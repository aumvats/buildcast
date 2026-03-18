import { HTMLAttributes, forwardRef } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: 'sm' | 'md' | 'lg';
}

const paddingStyles = {
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ padding = 'md', className = '', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`bg-surface border border-border rounded-lg transition-[border-color,box-shadow] duration-fast ${paddingStyles[padding]} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
export { Card };
