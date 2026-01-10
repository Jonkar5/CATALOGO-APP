import React from 'react';
import { cn } from './Input';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
        const variants = {
            primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20',
            secondary: 'bg-neutral-900 text-white hover:bg-neutral-800 shadow-lg shadow-neutral-900/20',
            outline: 'bg-transparent border border-neutral-200 text-neutral-900 hover:bg-neutral-50',
            ghost: 'bg-transparent text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900',
        };

        const sizes = {
            sm: 'h-9 px-3 text-xs',
            md: 'h-11 px-6 text-sm',
            lg: 'h-14 px-8 text-base',
        };

        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";
