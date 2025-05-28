'use client';

import { cn } from '@/lib/utils';

interface HamburgerButtonProps {
  isOpen: boolean;
  className?: string;
}

export function HamburgerButton({ isOpen, className }: HamburgerButtonProps) {
  return (
    <div
      className={cn('relative w-[30px] h-[30px] cursor-pointer', className)}
      data-state={isOpen ? 'open' : 'closed'}
    >
      {/* Horizontal line */}
      <div
        className={cn(
          'absolute top-1/2 left-0 w-full h-[2px] bg-white -translate-y-1/2',
          'transition-all duration-300'
        )}
      />

      {/* Vertical line */}
      <div
        className={cn(
          'absolute top-0 left-1/2 w-[2px] h-full bg-white -translate-x-1/2',
          'transition-all duration-300 ease-in-out',
          isOpen ? 'scale-y-0' : 'scale-y-100'
        )}
        style={{
          transformOrigin: 'center',
          willChange: 'transform',
        }}
      />
    </div>
  );
}
