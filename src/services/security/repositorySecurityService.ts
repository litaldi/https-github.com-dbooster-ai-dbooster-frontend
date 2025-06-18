
import { supabase } from '@/integrations/supabase/client';
import { auditLogger } from '../auditLogger';
import { productionLogger } from '@/utils/productionLogger';

export class RepositorySecurityService {
  private static instance: RepositorySecurityService;

  static getInstance(): RepositorySecurityService {
    if (!RepositorySecurityService.instance) {
      RepositorySecurityService.instance = new RepositorySecurityService();
    }
    return RepositorySecurityService.instance;
  }

  async validateRepositoryAccess(repositoryId: string, action: 'read' | 'write' | 'delete'): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        await auditLogger.logSecurityEvent({
          event_type: 'unauthorized_repository_access_attempt',
          event_data: { repositoryId, action, reason: 'no_user' }
        });
        return false;
      }

      // Verify repository ownership through RLS
      const { data: repository, error } = await supabase
        .from('repositories')
        .select('id, user_id')
        .eq('id', repositoryId)
        .single();

      if (error || !repository || repository.user_id !== user.id) {
        await auditLogger.logSecurityEvent({
          event_type: 'unauthorized_repository_access_attempt',
          event_data: {
            repositoryId,
            action,
            userId: user.id,
            reason: error ? 'query_error' : 'access_denied'
          }
        });
        return false;
      }

      return true;
    } catch (error) {
      productionLogger.error('Repository access validation failed', error, 'RepositorySecurityService');
      return false;
    }
  }
}

export const repositorySecurityService = RepositorySecurityService.getInstance();
