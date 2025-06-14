
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, Phone } from 'lucide-react';

interface LoginTypeSelectorProps {
  loginType: 'email' | 'phone';
  onTypeChange: (type: 'email' | 'phone') => void;
}

export function LoginTypeSelector({ loginType, onTypeChange }: LoginTypeSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">
        Sign in with
      </label>
      <Tabs value={loginType} onValueChange={(value) => onTypeChange(value as 'email' | 'phone')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email
          </TabsTrigger>
          <TabsTrigger value="phone" className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Phone
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
