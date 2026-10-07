'use client';

import * as React from 'react';
import { Menu as MenuPrimitive } from '@base-ui/react/menu';
import { Check, ChevronRight, Circle } from 'lucide-react';
import { cn } from '@src/lib/utils';

export type IDropdownMenuProps = MenuPrimitive.Root.Props;

function DropdownMenu({ ...props }: IDropdownMenuProps) {
  return <MenuPrimitive.Root data-slot='dropdown-menu' {...props} />;
}

export type IDropdownMenuPortalProps = MenuPrimitive.Portal.Props;

function DropdownMenuPortal({ ...props }: IDropdownMenuPortalProps) {
  return <MenuPrimitive.Portal data-slot='dropdown-menu-portal' {...props} />;
}

export interface IDropdownMenuTriggerProps
  extends MenuPrimitive.Trigger.Props {
  asChild?: boolean;
}

function DropdownMenuTrigger({
  asChild,
  children,
  render,
  ...props
}: IDropdownMenuTriggerProps) {
  const effectiveRender =
    asChild && React.isValidElement(children) ? children : render;

  return (
    <MenuPrimitive.Trigger
      data-slot='dropdown-menu-trigger'
      render={effectiveRender}
      {...props}
    >
      {asChild && React.isValidElement(children) ? undefined : children}
    </MenuPrimitive.Trigger>
  );
}

export interface IDropdownMenuContentProps
  extends MenuPrimitive.Popup.Props,
    Pick<
      MenuPrimitive.Positioner.Props,
      'align' | 'alignOffset' | 'side' | 'sideOffset'
    > {}

function DropdownMenuContent({
  align = 'start',
  alignOffset = 0,
  side = 'bottom',
  sideOffset = 4,
  className,
  ...props
}: IDropdownMenuContentProps) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner
        className='isolate z-50 outline-none'
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
      >
        <MenuPrimitive.Popup
          data-slot='dropdown-menu-content'
          className={cn(
            'cn-menu-target cn-menu-translucent z-50 max-h-(--available-height) w-(--anchor-width) min-w-32 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-md bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 outline-none data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:overflow-hidden data-closed:fade-out-0 data-closed:zoom-out-95',
            className
          )}
          {...props}
        />
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  );
}

export type IDropdownMenuGroupProps = MenuPrimitive.Group.Props;

function DropdownMenuGroup({ ...props }: IDropdownMenuGroupProps) {
  return <MenuPrimitive.Group data-slot='dropdown-menu-group' {...props} />;
}

export interface IDropdownMenuLabelProps
  extends MenuPrimitive.GroupLabel.Props {
  inset?: boolean;
}

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: IDropdownMenuLabelProps) {
  return (
    <MenuPrimitive.GroupLabel
      data-slot='dropdown-menu-label'
      data-inset={inset}
      className={cn(
        'px-2 py-1.5 text-xs font-medium text-muted-foreground data-inset:pl-8',
        className
      )}
      {...props}
    />
  );
}

export interface IDropdownMenuItemProps extends MenuPrimitive.Item.Props {
  inset?: boolean;
  variant?: 'default' | 'destructive';
}

function DropdownMenuItem({
  className,
  inset,
  variant = 'default',
  ...props
}: IDropdownMenuItemProps) {
  return (
    <MenuPrimitive.Item
      data-slot='dropdown-menu-item'
      data-inset={inset}
      data-variant={variant}
      className={cn(
        "group/dropdown-menu-item relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-inset:pl-8 data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 data-[variant=destructive]:*:[svg]:text-destructive",
        className
      )}
      {...props}
    />
  );
}

export type IDropdownMenuSubProps = MenuPrimitive.SubmenuRoot.Props;

function DropdownMenuSub({ ...props }: IDropdownMenuSubProps) {
  return <MenuPrimitive.SubmenuRoot data-slot='dropdown-menu-sub' {...props} />;
}

export interface IDropdownMenuSubTriggerProps
  extends MenuPrimitive.SubmenuTrigger.Props {
  inset?: boolean;
}

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: IDropdownMenuSubTriggerProps) {
  return (
    <MenuPrimitive.SubmenuTrigger
      data-slot='dropdown-menu-sub-trigger'
      data-inset={inset}
      className={cn(
        "flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-inset:pl-8 data-popup-open:bg-accent data-popup-open:text-accent-foreground data-open:bg-accent data-open:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children}
      <ChevronRight className='cn-rtl-flip ml-auto size-4' />
    </MenuPrimitive.SubmenuTrigger>
  );
}

export type IDropdownMenuSubContentProps = React.ComponentProps<
  typeof DropdownMenuContent
>;

function DropdownMenuSubContent({
  align = 'start',
  alignOffset = -3,
  side = 'right',
  sideOffset = 0,
  className,
  ...props
}: IDropdownMenuSubContentProps) {
  return (
    <DropdownMenuContent
      data-slot='dropdown-menu-sub-content'
      className={cn(
        'cn-menu-target cn-menu-translucent w-auto min-w-[96px] rounded-md bg-popover p-1 text-popover-foreground shadow-lg ring-1 ring-foreground/10 duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
        className
      )}
      align={align}
      alignOffset={alignOffset}
      side={side}
      sideOffset={sideOffset}
      {...props}
    />
  );
}

export interface IDropdownMenuCheckboxItemProps
  extends MenuPrimitive.CheckboxItem.Props {
  inset?: boolean;
}

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  inset,
  ...props
}: IDropdownMenuCheckboxItemProps) {
  return (
    <MenuPrimitive.CheckboxItem
      data-slot='dropdown-menu-checkbox-item'
      data-inset={inset}
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground data-inset:pl-8 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      checked={checked}
      {...props}
    >
      <span
        className='pointer-events-none absolute right-2 flex items-center justify-center'
        data-slot='dropdown-menu-checkbox-item-indicator'
      >
        <MenuPrimitive.CheckboxItemIndicator>
          <Check className='size-4' />
        </MenuPrimitive.CheckboxItemIndicator>
      </span>
      {children}
    </MenuPrimitive.CheckboxItem>
  );
}

export type IDropdownMenuRadioGroupProps = MenuPrimitive.RadioGroup.Props;

function DropdownMenuRadioGroup({
  ...props
}: IDropdownMenuRadioGroupProps) {
  return (
    <MenuPrimitive.RadioGroup
      data-slot='dropdown-menu-radio-group'
      {...props}
    />
  );
}

export interface IDropdownMenuRadioItemProps
  extends MenuPrimitive.RadioItem.Props {
  inset?: boolean;
}

function DropdownMenuRadioItem({
  className,
  children,
  inset,
  ...props
}: IDropdownMenuRadioItemProps) {
  return (
    <MenuPrimitive.RadioItem
      data-slot='dropdown-menu-radio-item'
      data-inset={inset}
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground data-inset:pl-8 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <span
        className='pointer-events-none absolute right-2 flex items-center justify-center'
        data-slot='dropdown-menu-radio-item-indicator'
      >
        <MenuPrimitive.RadioItemIndicator>
          <Circle className='size-2 fill-current' />
        </MenuPrimitive.RadioItemIndicator>
      </span>
      {children}
    </MenuPrimitive.RadioItem>
  );
}

export type IDropdownMenuSeparatorProps = MenuPrimitive.Separator.Props;

function DropdownMenuSeparator({
  className,
  ...props
}: IDropdownMenuSeparatorProps) {
  return (
    <MenuPrimitive.Separator
      data-slot='dropdown-menu-separator'
      className={cn('-mx-1 my-1 h-px bg-border', className)}
      {...props}
    />
  );
}

export type IDropdownMenuShortcutProps = React.ComponentProps<'span'>;

function DropdownMenuShortcut({
  className,
  ...props
}: IDropdownMenuShortcutProps) {
  return (
    <span
      data-slot='dropdown-menu-shortcut'
      className={cn(
        'ml-auto text-xs tracking-widest text-muted-foreground group-focus/dropdown-menu-item:text-accent-foreground',
        className
      )}
      {...props}
    />
  );
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
};
