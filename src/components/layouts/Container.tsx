import React from 'react';
import { cn } from '@src/lib/utils';

export interface IContainerProps {
  children: React.ReactNode;
  className?: string;
}

export default function Container({ children, className = '' }: IContainerProps) {
  return (
    <div className={cn('max-w-7xl mx-auto px-4', className)}>{children}</div>
  );
}
