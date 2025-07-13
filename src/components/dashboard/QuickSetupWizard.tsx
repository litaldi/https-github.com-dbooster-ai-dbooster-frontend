
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Database, Check, ArrowRight, ArrowLeft } from 'lucide-react';

interface QuickSetupWizardProps {
  onClose: () => void;
}

export function QuickSetupWizard({ onClose }: QuickSetupWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    repositoryName: '',
    databaseUrl: '',
    notificationEmail: ''
  });

  const steps = [
    {
      title: 'Welcome to DBooster',
      description: 'Let\'s get your database optimization setup in just a few steps'
    },
    {
      title: 'Connect Repository',
      description: 'Add your first database repository for analysis'
    },
    {
      title: 'Configure Notifications',
      description: 'Set up alerts for performance issues and optimizations'
    },
    {
      title: 'Setup Complete',
      description: 'You\'re all set! Start optimizing your database performance'
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-card border shadow-lg rounded-lg w-full max-w-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold">Quick Setup</h2>
            <p className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {steps.length}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6">
          {/* Progress Bar */}
          <div className="w-full bg-muted rounded-full h-2 mb-8">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="border-0 shadow-none">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl">{steps[currentStep].title}</CardTitle>
                  <CardDescription className="text-base">
                    {steps[currentStep].description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {currentStep === 0 && (
                    <div className="text-center py-8">
                      <Database className="h-16 w-16 mx-auto text-primary mb-4" />
                      <p className="text-muted-foreground">
                        DBooster helps you optimize your database performance with AI-powered insights and automated recommendations.
                      </p>
                    </div>
                  )}

                  {currentStep === 1 && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="repo-name">Repository Name</Label>
                        <Input
                          id="repo-name"
                          placeholder="e.g., my-backend-app"
                          value={formData.repositoryName}
                          onChange={(e) => handleInputChange('repositoryName', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="db-url">Database Connection String</Label>
                        <Input
                          id="db-url"
                          placeholder="postgresql://user:pass@host:port/db"
                          value={formData.databaseUrl}
                          onChange={(e) => handleInputChange('databaseUrl', e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="notification-email">Notification Email</Label>
                        <Input
                          id="notification-email"
                          type="email"
                          placeholder="you@company.com"
                          value={formData.notificationEmail}
                          onChange={(e) => handleInputChange('notificationEmail', e.target.value)}
                        />
                      </div>
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">You'll receive notifications for:</h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          <li>• Performance optimization opportunities</li>
                          <li>• Critical performance issues</li>
                          <li>• Weekly performance reports</li>
                        </ul>
                      </div>
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="text-center py-8">
                      <Check className="h-16 w-16 mx-auto text-green-600 mb-4" />
                      <p className="text-muted-foreground mb-6">
                        Perfect! Your DBooster setup is complete. You can now start monitoring and optimizing your database performance.
                      </p>
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Next Steps:</h4>
                        <ul className="space-y-1 text-sm text-muted-foreground text-left">
                          <li>• Check your dashboard for initial insights</li>
                          <li>• Review query optimization suggestions</li>
                          <li>• Set up additional repositories as needed</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-between p-6 border-t">
          <Button 
            variant="outline" 
            onClick={handlePrev}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          <Button onClick={handleNext}>
            {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
            {currentStep !== steps.length - 1 && <ArrowRight className="h-4 w-4 ml-2" />}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
