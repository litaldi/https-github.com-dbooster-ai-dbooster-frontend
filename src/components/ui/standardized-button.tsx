
import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';

export interface StandardizedButtonProps extends ButtonProps {}

export function StandardizedButton({ children, ...props }: StandardizedButtonProps) {
  return <Button {...props}>{children}</Button>;
}
