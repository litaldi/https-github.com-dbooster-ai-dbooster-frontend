
import React, { useState } from 'react';
import { EnhancedInput } from '@/components/ui/enhanced-input';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { ValidationMessage } from '@/components/ui/enhanced-feedback';
import { COPY } from '@/components/ui/enhanced-copy';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface FormField {
  name: string;
  type: 'text' | 'email' | 'password' | 'tel' | 'url';
  label: string;
  placeholder?: string;
  required?: boolean;
  validation?: (value: string) => string | null;
  helperText?: string;
}

interface EnhancedFormProps {
  title: string;
  description?: string;
  fields: FormField[];
  onSubmit: (data: Record<string, string>) => Promise<void>;
  submitLabel?: string;
  isLoading?: boolean;
  className?: string;
}

export function EnhancedForm({
  title,
  description,
  fields,
  onSubmit,
  submitLabel = COPY.buttons.submit,
  isLoading = false,
  className
}: EnhancedFormProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = (field: FormField, value: string): string | null => {
    // Required validation
    if (field.required && !value.trim()) {
      return COPY.errors.required;
    }

    // Custom validation
    if (field.validation && value) {
      return field.validation(value);
    }

    // Built-in validations
    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return COPY.errors.invalidEmail;
      }
    }

    return null;
  };

  const handleFieldChange = (fieldName: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    
    // Clear error when user starts typing
    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: '' }));
    }
  };

  const handleFieldBlur = (field: FormField) => {
    setTouched(prev => ({ ...prev, [field.name]: true }));
    
    const error = validateField(field, formData[field.name] || '');
    if (error) {
      setErrors(prev => ({ ...prev, [field.name]: error }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors: Record<string, string> = {};
    fields.forEach(field => {
      const error = validateField(field, formData[field.name] || '');
      if (error) {
        newErrors[field.name] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched(fields.reduce((acc, field) => ({ ...acc, [field.name]: true }), {}));
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      // Handle submission errors
      console.error('Form submission error:', error);
    }
  };

  return (
    <Card className={cn('w-full max-w-md mx-auto', className)}>
      <CardHeader className="text-center space-y-2">
        <CardTitle className="text-2xl font-bold">{title}</CardTitle>
        {description && (
          <CardDescription className="text-muted-foreground">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {fields.map((field) => (
            <EnhancedInput
              key={field.name}
              id={field.name}
              type={field.type}
              label={field.label}
              placeholder={field.placeholder || COPY.placeholders[field.type as keyof typeof COPY.placeholders]}
              value={formData[field.name] || ''}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              onBlur={() => handleFieldBlur(field)}
              error={touched[field.name] ? errors[field.name] : undefined}
              helperText={field.helperText}
              required={field.required}
              showValidation={touched[field.name]}
              isValid={touched[field.name] && !errors[field.name] && !!formData[field.name]}
            />
          ))}

          {Object.keys(errors).length > 0 && Object.keys(touched).length > 0 && (
            <ValidationMessage
              type="error"
              message={COPY.errors.validation}
            />
          )}

          <EnhancedButton
            type="submit"
            className="w-full"
            loading={isLoading}
            loadingText={COPY.loading.processing}
          >
            {submitLabel}
          </EnhancedButton>
        </form>
      </CardContent>
    </Card>
  );
}
