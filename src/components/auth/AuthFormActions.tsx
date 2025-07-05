
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { EnhancedCheckbox } from '@/components/ui/enhanced-checkbox';
import type { AuthMode } from '@/types/auth';

interface AuthFormData {
  email: string;
  password: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
  rememberMe?: boolean;
}

interface AuthFormActionsProps {
  authMode: AuthMode;
  formData: AuthFormData;
  isLoading: boolean;
  updateField: (field: keyof AuthFormData, value: string | boolean) => void;
  onAuthModeChange: (mode: AuthMode) => void;
}

export function AuthFormActions({ 
  authMode, 
  formData, 
  isLoading, 
  updateField, 
  onAuthModeChange 
}: AuthFormActionsProps) {
  return (
    <>
      {authMode === 'login' && (
        <div className="flex items-center justify-between">
          <EnhancedCheckbox
            id="rememberMe"
            label="Keep me signed in"
            checked={formData.rememberMe}
            onCheckedChange={(checked) => updateField('rememberMe', !!checked)}
          />
          <button
            type="button"
            className="text-sm text-primary hover:underline font-medium"
            onClick={() => onAuthModeChange('reset')}
          >
            Forgot password?
          </button>
        </div>
      )}

      <EnhancedButton
        type="submit"
        className="w-full"
        size="lg"
        loading={isLoading}
        loadingText={authMode === 'login' ? 'Signing you in...' : 'Creating your account...'}
        disabled={isLoading}
      >
        {authMode === 'login' ? 'Sign in to DBooster' : 'Start free enterprise trial'}
        <ArrowRight className="ml-2 h-4 w-4" />
      </EnhancedButton>
    </>
  );
}
