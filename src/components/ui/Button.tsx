import React from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'black';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', isLoading, disabled, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer whitespace-nowrap active:scale-[0.98]';

    const variants = {
      default: 'bg-emerald-800 text-white hover:bg-emerald-900 shadow-sm border border-emerald-900/40',
      secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200 border border-slate-200',
      outline: 'border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 shadow-xs',
      ghost: 'text-slate-700 hover:bg-slate-100 hover:text-slate-900',
      destructive: 'bg-red-700 text-white hover:bg-red-800 border border-red-800 shadow-sm',
      black: 'bg-slate-900 text-white hover:bg-black border border-black shadow-sm'
    };

    const sizes = {
      sm: 'h-9 px-3 text-xs rounded-md gap-1.5',
      md: 'h-10 px-4 py-2 text-sm rounded-md gap-2',
      lg: 'h-11 px-6 text-base rounded-lg gap-2.5',
      icon: 'h-10 w-10 p-0 rounded-md'
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
