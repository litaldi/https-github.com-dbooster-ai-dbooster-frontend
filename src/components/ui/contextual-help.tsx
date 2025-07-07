
import { useState } from 'react';
import { HelpCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';

const helpContent = {
  '/': {
    title: 'Welcome to DBooster',
    content: 'Get started by connecting your database or trying our demo queries.'
  },
  '/app/dashboard': {
    title: 'Dashboard Overview',
    content: 'Monitor your query performance and optimization metrics here.'
  },
  '/app/queries': {
    title: 'Query Management',
    content: 'Analyze, optimize, and manage your SQL queries efficiently.'
  },
  '/app/repositories': {
    title: 'Repository Scanner',
    content: 'Connect your repositories to automatically scan and optimize queries.'
  }
};

export function ContextualHelp() {
  const [isVisible, setIsVisible] = useState(false);
  const currentPath = window.location.pathname;

  const helpInfo = helpContent[currentPath as keyof typeof helpContent];

  if (!helpInfo) return null;

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-6 right-6 z-50 rounded-full shadow-lg"
        onClick={() => setIsVisible(!isVisible)}
      >
        <HelpCircle className="h-4 w-4" />
      </Button>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-20 right-6 z-50"
          >
            <Card className="w-80 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {helpInfo.title}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => setIsVisible(false)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  {helpInfo.content}
                </CardDescription>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
