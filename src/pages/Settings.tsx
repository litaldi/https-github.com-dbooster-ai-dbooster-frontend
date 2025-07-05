
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Settings as SettingsIcon, 
  Palette, 
  Globe, 
  Database, 
  Shield, 
  Zap,
  Monitor,
  Moon,
  Sun,
  Languages
} from 'lucide-react';
import { FadeIn } from '@/components/ui/animations';
import { useTheme } from '@/components/theme-provider';
import { useToast } from '@/hooks/use-toast';

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [appSettings, setAppSettings] = useState({
    autoSave: true,
    realTimeSync: true,
    compactMode: false,
    showPreview: true,
    enableAnimations: true,
    highContrast: false
  });

  const [performanceSettings, setPerformanceSettings] = useState({
    queryTimeout: '30',
    maxConnections: '10',
    cacheEnabled: true,
    backgroundSync: true,
    compressionEnabled: true
  });

  const [securitySettings, setSecuritySettings] = useState({
    sessionTimeout: '24',
    requireMFA: false,
    auditLogging: true,
    ipWhitelist: '',
    dataEncryption: true
  });

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Settings Saved",
        description: "Your preferences have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetToDefaults = () => {
    setAppSettings({
      autoSave: true,
      realTimeSync: true,
      compactMode: false,
      showPreview: true,
      enableAnimations: true,
      highContrast: false
    });
    toast({
      title: "Settings Reset",
      description: "All settings have been reset to default values.",
    });
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <FadeIn>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Application Settings</h1>
          <p className="text-muted-foreground">
            Customize your DBooster experience and configure system preferences.
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={0.2}>
        <Tabs defaultValue="appearance" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="general" className="flex items-center gap-2">
              <SettingsIcon className="w-4 h-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              Advanced
            </TabsTrigger>
          </TabsList>

          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Theme & Appearance</CardTitle>
                <CardDescription>
                  Customize the look and feel of your DBooster interface.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-base font-medium">Theme</Label>
                    <p className="text-sm text-muted-foreground mb-3">
                      Choose your preferred color scheme
                    </p>
                    <div className="grid grid-cols-3 gap-4">
                      <Card 
                        className={`cursor-pointer transition-all ${theme === 'light' ? 'ring-2 ring-primary' : ''}`}
                        onClick={() => setTheme('light')}
                      >
                        <CardContent className="p-4 text-center">
                          <Sun className="w-8 h-8 mx-auto mb-2" />
                          <p className="font-medium">Light</p>
                        </CardContent>
                      </Card>
                      <Card 
                        className={`cursor-pointer transition-all ${theme === 'dark' ? 'ring-2 ring-primary' : ''}`}
                        onClick={() => setTheme('dark')}
                      >
                        <CardContent className="p-4 text-center">
                          <Moon className="w-8 h-8 mx-auto mb-2" />
                          <p className="font-medium">Dark</p>
                        </CardContent>
                      </Card>
                      <Card 
                        className={`cursor-pointer transition-all ${theme === 'system' ? 'ring-2 ring-primary' : ''}`}
                        onClick={() => setTheme('system')}
                      >
                        <CardContent className="p-4 text-center">
                          <Monitor className="w-8 h-8 mx-auto mb-2" />
                          <p className="font-medium">System</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>High Contrast Mode</Label>
                        <p className="text-sm text-muted-foreground">
                          Increase contrast for better accessibility
                        </p>
                      </div>
                      <Switch
                        checked={appSettings.highContrast}
                        onCheckedChange={(checked) => 
                          setAppSettings(prev => ({ ...prev, highContrast: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Enable Animations</Label>
                        <p className="text-sm text-muted-foreground">
                          Use smooth transitions and animations
                        </p>
                      </div>
                      <Switch
                        checked={appSettings.enableAnimations}
                        onCheckedChange={(checked) => 
                          setAppSettings(prev => ({ ...prev, enableAnimations: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Compact Mode</Label>
                        <p className="text-sm text-muted-foreground">
                          Reduce spacing for more content density
                        </p>
                      </div>
                      <Switch
                        checked={appSettings.compactMode}
                        onCheckedChange={(checked) => 
                          setAppSettings(prev => ({ ...prev, compactMode: checked }))
                        }
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>General Preferences</CardTitle>
                <CardDescription>
                  Configure general application behavior and preferences.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="language">Language</Label>
                    <Select defaultValue="en">
                      <SelectTrigger className="w-full mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="de">Deutsch</SelectItem>
                        <SelectItem value="ja">日本語</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select defaultValue="utc">
                      <SelectTrigger className="w-full mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="utc">UTC</SelectItem>
                        <SelectItem value="est">Eastern Time</SelectItem>
                        <SelectItem value="pst">Pacific Time</SelectItem>
                        <SelectItem value="cet">Central European Time</SelectItem>
                        <SelectItem value="jst">Japan Standard Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Auto-save</Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically save changes as you work
                        </p>
                      </div>
                      <Switch
                        checked={appSettings.autoSave}
                        onCheckedChange={(checked) => 
                          setAppSettings(prev => ({ ...prev, autoSave: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Real-time Sync</Label>
                        <p className="text-sm text-muted-foreground">
                          Keep data synchronized across devices
                        </p>
                      </div>
                      <Switch
                        checked={appSettings.realTimeSync}
                        onCheckedChange={(checked) => 
                          setAppSettings(prev => ({ ...prev, realTimeSync: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Show Preview</Label>
                        <p className="text-sm text-muted-foreground">
                          Display preview panels where available
                        </p>
                      </div>
                      <Switch
                        checked={appSettings.showPreview}
                        onCheckedChange={(checked) => 
                          setAppSettings(prev => ({ ...prev, showPreview: checked }))
                        }
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Settings</CardTitle>
                <CardDescription>
                  Configure performance and optimization preferences.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="queryTimeout">Query Timeout (seconds)</Label>
                    <Input
                      id="queryTimeout"
                      type="number"
                      value={performanceSettings.queryTimeout}
                      onChange={(e) => setPerformanceSettings(prev => ({ 
                        ...prev, 
                        queryTimeout: e.target.value 
                      }))}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="maxConnections">Max Connections</Label>
                    <Input
                      id="maxConnections"
                      type="number"
                      value={performanceSettings.maxConnections}
                      onChange={(e) => setPerformanceSettings(prev => ({ 
                        ...prev, 
                        maxConnections: e.target.value 
                      }))}
                      className="mt-2"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Enable Caching</Label>
                      <p className="text-sm text-muted-foreground">
                        Cache frequently used queries for faster access
                      </p>
                    </div>
                    <Switch
                      checked={performanceSettings.cacheEnabled}
                      onCheckedChange={(checked) => 
                        setPerformanceSettings(prev => ({ ...prev, cacheEnabled: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Background Sync</Label>
                      <p className="text-sm text-muted-foreground">
                        Sync data in the background for better performance
                      </p>
                    </div>
                    <Switch
                      checked={performanceSettings.backgroundSync}
                      onCheckedChange={(checked) => 
                        setPerformanceSettings(prev => ({ ...prev, backgroundSync: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Compression</Label>
                      <p className="text-sm text-muted-foreground">
                        Compress data transfers to reduce bandwidth usage
                      </p>
                    </div>
                    <Switch
                      checked={performanceSettings.compressionEnabled}
                      onCheckedChange={(checked) => 
                        setPerformanceSettings(prev => ({ ...prev, compressionEnabled: checked }))
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Preferences</CardTitle>
                <CardDescription>
                  Configure security settings and access controls.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="sessionTimeout">Session Timeout (hours)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={securitySettings.sessionTimeout}
                    onChange={(e) => setSecuritySettings(prev => ({ 
                      ...prev, 
                      sessionTimeout: e.target.value 
                    }))}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="ipWhitelist">IP Whitelist</Label>
                  <Input
                    id="ipWhitelist"
                    placeholder="192.168.1.1, 10.0.0.1"
                    value={securitySettings.ipWhitelist}
                    onChange={(e) => setSecuritySettings(prev => ({ 
                      ...prev, 
                      ipWhitelist: e.target.value 
                    }))}
                    className="mt-2"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Comma-separated list of allowed IP addresses
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Require Multi-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">
                        Require MFA for all account access
                      </p>
                    </div>
                    <Switch
                      checked={securitySettings.requireMFA}
                      onCheckedChange={(checked) => 
                        setSecuritySettings(prev => ({ ...prev, requireMFA: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Audit Logging</Label>
                      <p className="text-sm text-muted-foreground">
                        Log all user actions for security auditing
                      </p>
                    </div>
                    <Switch
                      checked={securitySettings.auditLogging}
                      onCheckedChange={(checked) => 
                        setSecuritySettings(prev => ({ ...prev, auditLogging: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Data Encryption</Label>
                      <p className="text-sm text-muted-foreground">
                        Encrypt sensitive data at rest and in transit
                      </p>
                    </div>
                    <Badge variant="secondary">Always Enabled</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Configuration</CardTitle>
                <CardDescription>
                  Advanced settings for power users and system administrators.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label>API Configuration</Label>
                    <div className="mt-2 p-4 border rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Rate Limiting</span>
                        <Badge>1000 req/hour</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">API Version</span>
                        <Badge variant="outline">v2.1</Badge>
                      </div>
                      <Button variant="outline" size="sm">Configure API</Button>
                    </div>
                  </div>

                  <div>
                    <Label>Debug Mode</Label>
                    <div className="mt-2 p-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground mb-2">
                        Enable detailed logging and debug information
                      </p>
                      <Button variant="outline" size="sm">Enable Debug Mode</Button>
                    </div>
                  </div>

                  <div>
                    <Label>Data Export</Label>
                    <div className="mt-2 p-4 border rounded-lg space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Export your data in various formats
                      </p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Export JSON</Button>
                        <Button variant="outline" size="sm">Export CSV</Button>
                        <Button variant="outline" size="sm">Export SQL</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <div className="flex justify-between">
            <Button variant="outline" onClick={resetToDefaults}>
              Reset to Defaults
            </Button>
            <Button onClick={handleSaveSettings} disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save All Settings'}
            </Button>
          </div>
        </Tabs>
      </FadeIn>
    </div>
  );
}
