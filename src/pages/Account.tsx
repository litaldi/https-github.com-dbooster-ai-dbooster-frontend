
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/auth-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CreditCard, Github, LogOut, Crown } from 'lucide-react';

export default function Account() {
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error: any) {
      console.error('Logout error:', error);
    }
  };

  // Extract user information from Supabase user object
  const userName = user?.user_metadata?.full_name || user?.user_metadata?.name || 'User';
  const userEmail = user?.email || '';
  const userAvatar = user?.user_metadata?.avatar_url;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground">
          Manage your account information and subscription.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Your account details and authentication status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={userAvatar} alt={userName} />
                <AvatarFallback className="text-lg">{userName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-medium">{userName}</h3>
                <p className="text-muted-foreground">{userEmail}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  User ID: {user?.id}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Github className="w-5 h-5" />
                <div>
                  <p className="font-medium">GitHub</p>
                  <p className="text-sm text-muted-foreground">
                    {user?.app_metadata?.provider === 'github' ? 'Connected' : 'Not Connected'}
                  </p>
                </div>
              </div>
              <Badge className={user?.app_metadata?.provider === 'github' ? 
                "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" : 
                "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"}>
                {user?.app_metadata?.provider === 'github' ? 'Active' : 'Inactive'}
              </Badge>
            </div>

            <Button variant="destructive" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </CardContent>
        </Card>

        {/* Subscription */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-yellow-600" />
              Subscription
            </CardTitle>
            <CardDescription>Your current plan and billing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Pro Plan</span>
                <Badge>Active</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                $29/month • Renews on Jan 15, 2024
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Repositories</span>
                <span>5 / 10</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Monthly queries</span>
                <span>2,847 / 50,000</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Team members</span>
                <span>3 / 10</span>
              </div>
            </div>

            <div className="space-y-2">
              <Button className="w-full" variant="outline">
                <CreditCard className="w-4 h-4 mr-2" />
                Manage Billing
              </Button>
              <Button className="w-full">
                Upgrade Plan
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your recent actions and optimizations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { action: 'Approved optimization', target: 'user-service.ts:45', time: '2 hours ago' },
              { action: 'Connected repository', target: 'my-awesome-app', time: '1 day ago' },
              { action: 'Created team', target: 'Frontend Team', time: '3 days ago' },
              { action: 'Upgraded plan', target: 'Pro Plan', time: '1 week ago' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">{activity.target}</p>
                </div>
                <span className="text-sm text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
