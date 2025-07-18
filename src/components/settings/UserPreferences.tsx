
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Settings, Bell, Moon, Globe, Save } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { enhancedToast } from '@/components/ui/enhanced-toast';

export function UserPreferences() {
  const { theme, setTheme } = useTheme();
  const [preferences, setPreferences] = useState({
    notifications: {
      email: true,
      push: false,
      scanComplete: true,
      weeklyReport: true,
      securityAlerts: true
    },
    language: 'en',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    autoScan: false,
    compactMode: false
  });

  const handleSave = async () => {
    try {
      // Mock save functionality
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      enhancedToast.success({
        title: 'Preferences Saved',
        description: 'Your preferences have been updated successfully'
      });
    } catch (error) {
      enhancedToast.error({
        title: 'Save Failed',
        description: 'Could not save preferences. Please try again.'
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            General Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="theme">Theme</Label>
                <p className="text-sm text-muted-foreground">Choose your preferred theme</p>
              </div>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="language">Language</Label>
                <p className="text-sm text-muted-foreground">Select your preferred language</p>
              </div>
              <Select value={preferences.language} onValueChange={(value) => 
                setPreferences(prev => ({ ...prev, language: value }))
              }>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="timezone">Timezone</Label>
                <p className="text-sm text-muted-foreground">Your local timezone</p>
              </div>
              <Select value={preferences.timezone} onValueChange={(value) => 
                setPreferences(prev => ({ ...prev, timezone: value }))
              }>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTC">UTC</SelectItem>
                  <SelectItem value="America/New_York">Eastern Time</SelectItem>
                  <SelectItem value="America/Chicago">Central Time</SelectItem>
                  <SelectItem value="America/Denver">Mountain Time</SelectItem>
                  <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="compact-mode">Compact Mode</Label>
                <p className="text-sm text-muted-foreground">Use a more compact interface</p>
              </div>
              <Switch
                id="compact-mode"
                checked={preferences.compactMode}
                onCheckedChange={(checked) => 
                  setPreferences(prev => ({ ...prev, compactMode: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto-scan">Auto-scan New Repositories</Label>
                <p className="text-sm text-muted-foreground">Automatically scan repositories when added</p>
              </div>
              <Switch
                id="auto-scan"
                checked={preferences.autoScan}
                onCheckedChange={(checked) => 
                  setPreferences(prev => ({ ...prev, autoScan: checked }))
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive notifications via email</p>
              </div>
              <Switch
                id="email-notifications"
                checked={preferences.notifications.email}
                onCheckedChange={(checked) => 
                  setPreferences(prev => ({ 
                    ...prev, 
                    notifications: { ...prev.notifications, email: checked }
                  }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="push-notifications">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive browser push notifications</p>
              </div>
              <Switch
                id="push-notifications"
                checked={preferences.notifications.push}
                onCheckedChange={(checked) => 
                  setPreferences(prev => ({ 
                    ...prev, 
                    notifications: { ...prev.notifications, push: checked }
                  }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="scan-complete">Scan Complete Notifications</Label>
                <p className="text-sm text-muted-foreground">Notify when repository scans finish</p>
              </div>
              <Switch
                id="scan-complete"
                checked={preferences.notifications.scanComplete}
                onCheckedChange={(checked) => 
                  setPreferences(prev => ({ 
                    ...prev, 
                    notifications: { ...prev.notifications, scanComplete: checked }
                  }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="weekly-report">Weekly Reports</Label>
                <p className="text-sm text-muted-foreground">Receive weekly performance reports</p>
              </div>
              <Switch
                id="weekly-report"
                checked={preferences.notifications.weeklyReport}
                onCheckedChange={(checked) => 
                  setPreferences(prev => ({ 
                    ...prev, 
                    notifications: { ...prev.notifications, weeklyReport: checked }
                  }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="security-alerts">Security Alerts</Label>
                <p className="text-sm text-muted-foreground">Important security notifications</p>
              </div>
              <Switch
                id="security-alerts"
                checked={preferences.notifications.securityAlerts}
                onCheckedChange={(checked) => 
                  setPreferences(prev => ({ 
                    ...prev, 
                    notifications: { ...prev.notifications, securityAlerts: checked }
                  }))
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Save Preferences
        </Button>
      </div>
    </div>
  );
}
