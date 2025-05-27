
import { TabsContent } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface LoginTypeFieldsProps {
  loginType: 'email' | 'phone';
  formData: {
    email: string;
    phone: string;
  };
  errors: Record<string, string>;
  onInputChange: (field: string, value: string) => void;
}

export function LoginTypeFields({ loginType, formData, errors, onInputChange }: LoginTypeFieldsProps) {
  return (
    <>
      <TabsContent value="email" className="space-y-2 mt-4">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={(e) => onInputChange('email', e.target.value)}
          className={cn(errors.email && "border-destructive")}
          aria-describedby={errors.email ? "email-error" : undefined}
          autoComplete="email"
        />
        {errors.email && (
          <p id="email-error" className="text-sm text-destructive" role="alert">
            {errors.email}
          </p>
        )}
      </TabsContent>

      <TabsContent value="phone" className="space-y-2 mt-4">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+1 (555) 123-4567"
          value={formData.phone}
          onChange={(e) => onInputChange('phone', e.target.value)}
          className={cn(errors.phone && "border-destructive")}
          aria-describedby={errors.phone ? "phone-error" : undefined}
          autoComplete="tel"
        />
        {errors.phone && (
          <p id="phone-error" className="text-sm text-destructive" role="alert">
            {errors.phone}
          </p>
        )}
      </TabsContent>
    </>
  );
}
