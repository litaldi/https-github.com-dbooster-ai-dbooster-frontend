
import { Mail, Phone } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface LoginTypeSelectorProps {
  loginType: 'email' | 'phone';
  onTypeChange: (type: 'email' | 'phone') => void;
}

export function LoginTypeSelector({ loginType, onTypeChange }: LoginTypeSelectorProps) {
  return (
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
  );
}
