import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ICardProps extends React.ComponentProps<'div'> {
  size?: 'default' | 'sm';
}

function Card({
  className,
  size = 'default',
  ...props
}: ICardProps) {
  return (
    <div
      data-slot='card'
      data-size={size}
      className={cn(
        'group/card flex flex-col gap-(--card-spacing) overflow-hidden rounded-xl bg-card py-(--card-spacing) text-sm text-card-foreground shadow-xs ring-1 ring-foreground/10 [--card-spacing:--spacing(6)] has-[>img:first-child]:pt-0 data-[size=sm]:[--card-spacing:--spacing(4)] *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl',
        className
      )}
      {...props}
    />
  );
}

export type ICardHeaderProps = React.ComponentProps<'div'>;

function CardHeader({ className, ...props }: ICardHeaderProps) {
  return (
    <div
      data-slot='card-header'
      className={cn(
        'group/card-header @container/card-header grid auto-rows-min items-start gap-1 rounded-t-xl px-(--card-spacing) has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-(--card-spacing)',
        className
      )}
      {...props}
    />
  );
}

export type ICardTitleProps = React.ComponentProps<'div'>;

function CardTitle({ className, ...props }: ICardTitleProps) {
  return (
    <div
      data-slot='card-title'
      className={cn(
        'cn-font-heading text-base leading-normal font-medium group-data-[size=sm]/card:text-sm',
        className
      )}
      {...props}
    />
  );
}

export type ICardDescriptionProps = React.ComponentProps<'div'>;

function CardDescription({ className, ...props }: ICardDescriptionProps) {
  return (
    <div
      data-slot='card-description'
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  );
}

export type ICardActionProps = React.ComponentProps<'div'>;

function CardAction({ className, ...props }: ICardActionProps) {
  return (
    <div
      data-slot='card-action'
      className={cn(
        'col-start-2 row-span-2 row-start-1 self-start justify-self-end',
        className
      )}
      {...props}
    />
  );
}

export type ICardContentProps = React.ComponentProps<'div'>;

function CardContent({ className, ...props }: ICardContentProps) {
  return (
    <div
      data-slot='card-content'
      className={cn('flex flex-col gap-3 px-(--card-spacing)', className)}
      {...props}
    />
  );
}

export type ICardFooterProps = React.ComponentProps<'div'>;

function CardFooter({ className, ...props }: ICardFooterProps) {
  return (
    <div
      data-slot='card-footer'
      className={cn(
        'flex items-center rounded-b-xl px-(--card-spacing) [.border-t]:pt-(--card-spacing)',
        className
      )}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
