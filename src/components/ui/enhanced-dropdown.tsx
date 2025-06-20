
import React from 'react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { cn } from '@/lib/utils';

const EnhancedDropdownMenu = DropdownMenuPrimitive.Root;

const EnhancedDropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

const EnhancedDropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        'z-[200] min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg',
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
        'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2',
        'data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        'backdrop-blur-sm bg-background/95 border-border/40',
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
));
EnhancedDropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

const EnhancedDropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none',
      'transition-colors focus:bg-accent focus:text-accent-foreground',
      'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      'hover:bg-accent/50 focus-visible:bg-accent',
      inset && 'pl-8',
      className
    )}
    {...props}
  />
));
EnhancedDropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

export {
  EnhancedDropdownMenu,
  EnhancedDropdownMenuTrigger,
  EnhancedDropdownMenuContent,
  EnhancedDropdownMenuItem,
};
