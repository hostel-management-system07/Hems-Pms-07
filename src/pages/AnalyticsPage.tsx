
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

export function AnalyticsPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">
            Analyze product performance and team productivity
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Product Analytics
            </CardTitle>
            <CardDescription>
              This feature is coming soon! You'll be able to view detailed analytics and reports.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Analytics Dashboard Coming Soon</h3>
              <p className="text-muted-foreground">
                We're building comprehensive analytics including product performance metrics, team productivity insights, and custom reporting tools.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
