
/**
 * Edge Functions API Endpoints
 */

import { supabase } from '@/integrations/supabase/client';
import { SUPABASE_CONFIG } from './config';

export const EDGE_FUNCTIONS = {
  securityValidation: {
    invoke: (body: any) => supabase.functions.invoke('security-validation', { body }),
    url: `${SUPABASE_CONFIG.url}/functions/v1/security-validation`,
    path: '/functions/security-validation'
  }
} as const;
