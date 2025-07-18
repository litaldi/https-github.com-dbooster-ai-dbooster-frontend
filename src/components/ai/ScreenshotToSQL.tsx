
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Camera, Upload, Loader2, Copy, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { visualAIService } from '@/services/ai/visualAIService';
import { enhancedToast } from '@/components/ui/enhanced-toast';

export function ScreenshotToSQL() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedSQL, setGeneratedSQL] = useState('');
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleScreenshot = async () => {
    try {
      setIsProcessing(true);
      const screenshot = await visualAIService.captureScreenshot();
      setCapturedImage(screenshot);
      
      const result = await visualAIService.analyzeScreenshot({
        imageData: screenshot,
        analysisType: 'table',
        context: 'Convert this database table or diagram to SQL'
      });
      
      setAnalysisResult(result);
      setGeneratedSQL(result.suggestedSQL || '');
      
      enhancedToast.success({
        title: 'Screenshot Analyzed',
        description: 'SQL code generated successfully from your screenshot'
      });
    } catch (error) {
      console.error('Screenshot analysis failed:', error);
      enhancedToast.error({
        title: 'Analysis Failed',
        description: 'Could not analyze screenshot. Please try again.'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessing(true);
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        const imageData = e.target?.result as string;
        setCapturedImage(imageData);
        
        const result = await visualAIService.analyzeScreenshot({
          imageData,
          analysisType: 'diagram',
          context: 'Analyze this database diagram and generate SQL'
        });
        
        setAnalysisResult(result);
        setGeneratedSQL(result.suggestedSQL || '');
        
        enhancedToast.success({
          title: 'Image Analyzed',
          description: 'SQL code generated from uploaded image'
        });
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Image analysis failed:', error);
      enhancedToast.error({
        title: 'Analysis Failed',
        description: 'Could not analyze image. Please try again.'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = async () => {
    if (generatedSQL) {
      await navigator.clipboard.writeText(generatedSQL);
      enhancedToast.success({
        title: 'Copied',
        description: 'SQL code copied to clipboard'
      });
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5 text-primary" />
          Screenshot to SQL Converter
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-3">
          <Button 
            onClick={handleScreenshot}
            disabled={isProcessing}
            variant="outline"
            className="flex-1"
          >
            {isProcessing ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Camera className="h-4 w-4 mr-2" />
            )}
            Capture Screen
          </Button>
          
          <Button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            variant="outline"
            className="flex-1"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Image
          </Button>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>

        <AnimatePresence>
          {capturedImage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className="border rounded-lg p-4">
                <img 
                  src={capturedImage} 
                  alt="Captured screenshot" 
                  className="max-w-full h-48 object-contain mx-auto rounded"
                />
              </div>
              
              {analysisResult && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Analysis Complete:</strong> {analysisResult.description}
                    <div className="mt-2 flex gap-2 flex-wrap">
                      {analysisResult.detectedElements.map((element: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {element}
                        </Badge>
                      ))}
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {generatedSQL && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Generated SQL</h4>
              <Button
                onClick={copyToClipboard}
                size="sm"
                variant="ghost"
              >
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </Button>
            </div>
            
            <Textarea
              value={generatedSQL}
              onChange={(e) => setGeneratedSQL(e.target.value)}
              className="font-mono text-sm min-h-[120px]"
              placeholder="Generated SQL will appear here..."
            />
            
            {analysisResult && analysisResult.recommendations.length > 0 && (
              <div className="space-y-2">
                <h5 className="text-sm font-medium">Recommendations:</h5>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {analysisResult.recommendations.map((rec: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}

        {!capturedImage && !isProcessing && (
          <div className="text-center py-8 text-muted-foreground">
            <Camera className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>Capture a screenshot or upload an image to generate SQL</p>
            <p className="text-xs mt-1">Supports database tables, ER diagrams, and schema images</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
