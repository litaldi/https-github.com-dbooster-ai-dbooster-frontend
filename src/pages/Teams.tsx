
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Users, Plus, Settings, Activity } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function Teams() {
  const [selectedTeam, setSelectedTeam] = useState('frontend');

  const teams = [
    {
      id: 'frontend',
      name: 'Frontend Team',
      description: 'React and TypeScript applications',
      members: 5,
      repositories: 3,
      activity: 'High',
    },
    {
      id: 'backend',
      name: 'Backend Team',
      description: 'API and database services',
      members: 4,
      repositories: 5,
      activity: 'Medium',
    },
    {
      id: 'mobile',
      name: 'Mobile Team',
      description: 'React Native applications',
      members: 3,
      repositories: 2,
      activity: 'Low',
    },
  ];

  const teamMembers = [
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', avatar: '/placeholder.svg' },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'Member', avatar: '/placeholder.svg' },
    { id: 3, name: 'Carol White', email: 'carol@example.com', role: 'Member', avatar: '/placeholder.svg' },
    { id: 4, name: 'David Brown', email: 'david@example.com', role: 'Viewer', avatar: '/placeholder.svg' },
    { id: 5, name: 'Eve Davis', email: 'eve@example.com', role: 'Member', avatar: '/placeholder.svg' },
  ];

  const teamRepositories = [
    { name: 'frontend-app', queries: 145, optimizations: 12, lastScan: '2 hours ago' },
    { name: 'admin-dashboard', queries: 89, optimizations: 7, lastScan: '1 day ago' },
    { name: 'user-portal', queries: 67, optimizations: 5, lastScan: '3 hours ago' },
  ];

  const handleCreateTeam = () => {
    toast({
      title: "Team Created",
      description: "New team has been created successfully.",
    });
  };

  const currentTeam = teams.find(team => team.id === selectedTeam);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Teams</h1>
          <p className="text-muted-foreground">
            Organize your repositories and manage team access.
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Team
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Team</DialogTitle>
              <DialogDescription>
                Set up a new team to organize your repositories and members.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="team-name">Team Name</Label>
                <Input id="team-name" placeholder="e.g., Frontend Team" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="team-description">Description</Label>
                <Input id="team-description" placeholder="What does this team work on?" />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateTeam}>Create Team</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Team List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Teams
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {teams.map((team) => (
              <div
                key={team.id}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedTeam === team.id 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' 
                    : 'hover:bg-muted'
                }`}
                onClick={() => setSelectedTeam(team.id)}
              >
                <p className="font-medium">{team.name}</p>
                <p className="text-sm text-muted-foreground">{team.members} members</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Team Details */}
        <div className="lg:col-span-3 space-y-6">
          {currentTeam && (
            <>
              {/* Team Overview */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>{currentTeam.name}</CardTitle>
                    <CardDescription>{currentTeam.description}</CardDescription>
                  </div>
                  <Button variant="outline">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold">{currentTeam.members}</p>
                      <p className="text-sm text-muted-foreground">Members</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{currentTeam.repositories}</p>
                      <p className="text-sm text-muted-foreground">Repositories</p>
                    </div>
                    <div className="text-center">
                      <Badge 
                        variant={currentTeam.activity === 'High' ? 'default' : 
                                currentTeam.activity === 'Medium' ? 'secondary' : 'outline'}
                      >
                        {currentTeam.activity} Activity
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Team Members */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Team Members</CardTitle>
                  <Button variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Member
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {teamMembers.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={member.avatar} alt={member.name} />
                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{member.name}</p>
                            <p className="text-sm text-muted-foreground">{member.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={member.role === 'Admin' ? 'default' : 'secondary'}>
                            {member.role}
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <Settings className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Team Repositories */}
              <Card>
                <CardHeader>
                  <CardTitle>Team Repositories</CardTitle>
                  <CardDescription>Repositories assigned to this team</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {teamRepositories.map((repo, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{repo.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {repo.queries} queries • {repo.optimizations} optimizations
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Last scan</p>
                          <p className="text-sm">{repo.lastScan}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
