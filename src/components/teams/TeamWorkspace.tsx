
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  Plus, 
  Settings, 
  Crown, 
  UserCheck, 
  Clock,
  Database,
  Activity,
  Shield
} from 'lucide-react';
import { FadeIn } from '@/components/ui/enhanced-animations';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  avatar?: string;
  lastActive: string;
  queriesOptimized: number;
}

export function TeamWorkspace() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const teamMembers: TeamMember[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      role: 'admin',
      lastActive: '2 minutes ago',
      queriesOptimized: 147
    },
    {
      id: '2',
      name: 'Michael Chen',
      email: 'michael.chen@company.com',
      role: 'editor',
      lastActive: '1 hour ago',
      queriesOptimized: 89
    },
    {
      id: '3',
      name: 'Emily Davis',
      email: 'emily.davis@company.com',
      role: 'editor',
      lastActive: '3 hours ago',
      queriesOptimized: 156
    },
    {
      id: '4',
      name: 'David Wilson',
      email: 'david.wilson@company.com',
      role: 'viewer',
      lastActive: '1 day ago',
      queriesOptimized: 23
    }
  ];

  const filteredMembers = teamMembers.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Crown className="h-4 w-4 text-yellow-600" />;
      case 'editor':
        return <UserCheck className="h-4 w-4 text-blue-600" />;
      default:
        return <Users className="h-4 w-4 text-gray-600" />;
    }
  };

  const getRoleBadge = (role: string) => {
    const colors = {
      admin: 'bg-yellow-100 text-yellow-800',
      editor: 'bg-blue-100 text-blue-800',
      viewer: 'bg-gray-100 text-gray-800'
    };
    
    return (
      <Badge variant="secondary" className={colors[role as keyof typeof colors]}>
        {getRoleIcon(role)}
        <span className="ml-1 capitalize">{role}</span>
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Team Overview */}
      <FadeIn>
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-8 w-8 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold">{teamMembers.length}</div>
                  <div className="text-xs text-muted-foreground">Team Members</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Database className="h-8 w-8 text-green-600" />
                <div>
                  <div className="text-2xl font-bold">415</div>
                  <div className="text-xs text-muted-foreground">Queries Optimized</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Activity className="h-8 w-8 text-purple-600" />
                <div>
                  <div className="text-2xl font-bold">73%</div>
                  <div className="text-xs text-muted-foreground">Avg Performance Gain</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Shield className="h-8 w-8 text-orange-600" />
                <div>
                  <div className="text-2xl font-bold">100%</div>
                  <div className="text-xs text-muted-foreground">SOC2 Compliant</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </FadeIn>

      {/* Team Management */}
      <FadeIn delay={0.2}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Team Members
              </CardTitle>
              <div className="flex gap-2">
                <EnhancedButton size="sm" variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Manage Roles
                </EnhancedButton>
                <EnhancedButton size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Invite Member
                </EnhancedButton>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Search team members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            <div className="space-y-3">
              {filteredMembers.map((member, index) => (
                <FadeIn key={member.id} delay={index * 0.1}>
                  <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-muted-foreground">{member.email}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            Active {member.lastActive}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm font-medium">{member.queriesOptimized}</div>
                        <div className="text-xs text-muted-foreground">Queries optimized</div>
                      </div>
                      
                      {getRoleBadge(member.role)}
                      
                      <EnhancedButton size="sm" variant="ghost">
                        <Settings className="h-4 w-4" />
                      </EnhancedButton>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  );
}
