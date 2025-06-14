
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageCircle, Star, Send } from 'lucide-react';
import { enhancedToast } from '@/components/ui/enhanced-toast';

export function FeedbackButton() {
  const [feedback, setFeedback] = useState('');
  const [category, setCategory] = useState('');
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim() || !category) return;

    setIsSubmitting(true);
    
    try {
      // Simulate feedback submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      enhancedToast.success({
        title: 'Feedback Submitted!',
        description: 'Thank you for your feedback. We appreciate your input and will review it soon.'
      });
      
      // Reset form
      setFeedback('');
      setCategory('');
      setRating(0);
      setIsOpen(false);
    } catch (error) {
      enhancedToast.error({
        title: 'Submission Failed',
        description: 'Failed to submit feedback. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="fixed bottom-4 right-4 z-50 shadow-lg hover:shadow-xl transition-shadow bg-white dark:bg-gray-900"
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          Feedback
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-blue-600" />
            Share Your Feedback
          </DialogTitle>
          <DialogDescription>
            Help us improve DBooster by sharing your thoughts, suggestions, or reporting issues.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select feedback category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="feature-request">Feature Request</SelectItem>
                <SelectItem value="bug-report">Bug Report</SelectItem>
                <SelectItem value="improvement">Improvement Suggestion</SelectItem>
                <SelectItem value="general">General Feedback</SelectItem>
                <SelectItem value="performance">Performance Issue</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Rating (Optional)</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded"
                >
                  <Star
                    className={`h-6 w-6 transition-colors ${
                      star <= rating
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300 hover:text-yellow-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="feedback">Your Feedback</Label>
            <Textarea
              id="feedback"
              placeholder="Tell us what you think, what could be improved, or any issues you've encountered..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="min-h-[100px]"
              required
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!feedback.trim() || !category || isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                'Sending...'
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
