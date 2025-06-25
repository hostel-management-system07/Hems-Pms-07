
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';

export function FeedbackPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Customer Feedback</h1>
          <p className="text-muted-foreground">
            Collect and analyze customer feedback with AI insights
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              Feedback Management
            </CardTitle>
            <CardDescription>
              This feature is coming soon! You'll be able to collect, analyze, and act on customer feedback.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Feedback System Coming Soon</h3>
              <p className="text-muted-foreground">
                We're developing an intelligent feedback system with sentiment analysis, automated categorization, and actionable insights powered by Google AI.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
