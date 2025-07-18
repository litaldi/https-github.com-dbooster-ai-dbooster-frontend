
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Mail, 
  Building, 
  Users, 
  CreditCard, 
  Calendar,
  Shield,
  Camera,
  Save,
  Plus,
  Crown,
  Settings
} from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { enhancedToast } from '@/components/ui/enhanced-toast';

export default function AccountPage() {
  const { user, isDemo } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: user?.email || '',
    company: 'Acme Corporation',
    role: 'Senior Developer',
    phone: '+1 (555) 123-4567',
    timezone: 'America/New_York',
    bio: 'Passionate about database optimization and performance tuning.'
  });

  const handleSaveProfile = async () => {
    try {
      // Mock save functionality
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      enhancedToast.success({
        title: 'Profile Updated',
        description: 'Your profile has been updated successfully'
      });
    } catch (error) {
      enhancedToast.error({
        title: 'Update Failed',
        description: 'Could not update profile. Please try again.'
      });
    }
  };

  const teamMembers = [
    { id: 1, name: 'John Doe', email: 'john@acme.com', role: 'Owner', avatar: null },
    { id: 2, name: 'Jane Smith', email: 'jane@acme.com', role: 'Admin', avatar: null },
    { id: 3, name: 'Mike Johnson', email: 'mike@acme.com', role: 'Member', avatar: null }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Account Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage your profile, team settings, and account preferences.
          </p>
        </div>
        {isDemo && (
          <Badge variant="secondary" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Demo Mode
          </Badge>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="team" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Team
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Billing
          </TabsTrigger>
          <TabsTrigger value="usage" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Usage
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src="" />
                      <AvatarFallback className="text-lg">
                        {profileData.firstName[0]}{profileData.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">
                      {profileData.firstName} {profileData.lastName}
                    </h3>
                    <p className="text-muted-foreground">{profileData.role}</p>
                    <p className="text-sm text-muted-foreground">{profileData.company}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={profileData.firstName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={profileData.lastName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      disabled
                    />
                    <p className="text-xs text-muted-foreground">
                      Email cannot be changed. Contact support if needed.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={profileData.company}
                      onChange={(e) => setProfileData(prev => ({ ...prev, company: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="role">Job Title</Label>
                    <Input
                      id="role"
                      value={profileData.role}
                      onChange={(e) => setProfileData(prev => ({ ...prev, role: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <textarea
                    id="bio"
                    className="w-full min-h-[100px] px-3 py-2 border border-input bg-background rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    value={profileData.bio}
                    onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <Button onClick={handleSaveProfile} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="team">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Team Members
                  </CardTitle>
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Invite Member
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teamMembers.map(member => (
                    <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={member.avatar || ''} />
                          <AvatarFallback>
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{member.name}</h4>
                          <p className="text-sm text-muted-foreground">{member.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={member.role === 'Owner' ? 'default' : 'secondary'}>
                          {member.role === 'Owner' && <Crown className="h-3 w-3 mr-1" />}
                          {member.role}
                        </Badge>
                        {member.role !== 'Owner' && (
                          <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Team Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="teamName">Team Name</Label>
                  <Input id="teamName" defaultValue="Acme Development Team" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="defaultRole">Default Role for New Members</Label>
                  <select className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm">
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                
                <Button>Save Team Settings</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="billing">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Current Plan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg">
                  <div>
                    <h4 className="font-semibold">Professional Plan</h4>
                    <p className="text-sm text-muted-foreground">$29/month • Next billing: Jan 15, 2025</p>
                  </div>
                  <Badge className="bg-primary text-primary-foreground">Active</Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold">50</p>
                    <p className="text-sm text-muted-foreground">Repository Limit</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold">10</p>
                    <p className="text-sm text-muted-foreground">Team Members</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button>Upgrade Plan</Button>
                  <Button variant="outline">Change Plan</Button>
                  <Button variant="outline">Cancel Subscription</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-5 bg-gradient-to-r from-blue-600 to-blue-400 rounded"></div>
                    <div>
                      <p className="font-medium">•••• •••• •••• 4242</p>
                      <p className="text-sm text-muted-foreground">Expires 12/2025</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Update</Button>
                </div>
                
                <Button variant="outline" className="w-full">
                  Add Payment Method
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="usage">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Usage Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">5</p>
                    <p className="text-sm text-muted-foreground">Repositories Connected</p>
                    <p className="text-xs text-muted-foreground mt-1">out of 50</p>
                  </div>
                  
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold text-green-600">147</p>
                    <p className="text-sm text-muted-foreground">Queries Analyzed</p>
                    <p className="text-xs text-muted-foreground mt-1">this month</p>
                  </div>
                  
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">23</p>
                    <p className="text-sm text-muted-foreground">Scans Performed</p>
                    <p className="text-xs text-muted-foreground mt-1">this month</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Recent Activity</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h5 className="font-medium">Repository Scan Completed</h5>
                        <p className="text-sm text-muted-foreground">user-management-api</p>
                      </div>
                      <p className="text-sm text-muted-foreground">2 hours ago</p>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h5 className="font-medium">New Repository Added</h5>
                        <p className="text-sm text-muted-foreground">analytics-dashboard</p>
                      </div>
                      <p className="text-sm text-muted-foreground">1 day ago</p>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h5 className="font-medium">Team Member Invited</h5>
                        <p className="text-sm text-muted-foreground">sarah@acme.com</p>
                      </div>
                      <p className="text-sm text-muted-foreground">3 days ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
