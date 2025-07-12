
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Play, 
  Pause, 
  SkipForward, 
  RotateCcw,
  CheckCircle,
  Circle
} from "lucide-react";

const tourFeatures = [
  {
    id: "dashboard",
    title: "Explore Dashboard",
    description: "Navigate through performance metrics and system overview",
    completed: true
  },
  {
    id: "queries",
    title: "Query Management",
    description: "Learn how to optimize and manage your SQL queries",
    completed: false
  },
  {
    id: "reports",
    title: "Generate Reports",
    description: "Create detailed performance and optimization reports",
    completed: false
  },
  {
    id: "monitoring",
    title: "Real-time Monitoring",
    description: "Set up continuous monitoring for your databases",
    completed: false
  }
];

interface InteractiveTourProps {
  className?: string;
}

export function InteractiveTour({ className }: InteractiveTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);
  
  const completedSteps = tourFeatures.filter(feature => feature.completed).length;
  const progressPercentage = (completedSteps / tourFeatures.length) * 100;

  const handleStartTour = () => {
    setIsActive(true);
    setCurrentStep(0);
  };

  const handleNextStep = () => {
    if (currentStep < tourFeatures.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsActive(false);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsActive(false);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Interactive Tour</CardTitle>
            <CardDescription>
              Step-by-step guidance through DBooster features
            </CardDescription>
          </div>
          <Badge variant="outline">
            {completedSteps}/{tourFeatures.length} Complete
          </Badge>
        </div>
        <Progress value={progressPercentage} className="mt-2" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {tourFeatures.map((feature, index) => (
            <div 
              key={feature.id}
              className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                index === currentStep && isActive ? 'bg-primary/10 border border-primary/20' : ''
              }`}
            >
              <div className="flex-shrink-0">
                {feature.completed ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <Circle className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium">{feature.title}</h4>
                <p className="text-xs text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 pt-2 border-t">
          {!isActive ? (
            <Button onClick={handleStartTour} size="sm">
              <Play className="h-4 w-4 mr-2" />
              Start Tour
            </Button>
          ) : (
            <>
              <Button onClick={handleNextStep} size="sm">
                <SkipForward className="h-4 w-4 mr-2" />
                Next Step
              </Button>
              <Button onClick={() => setIsActive(false)} variant="outline" size="sm">
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </Button>
            </>
          )}
          <Button onClick={handleReset} variant="ghost" size="sm">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
