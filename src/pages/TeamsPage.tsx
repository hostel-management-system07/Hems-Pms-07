
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

export function TeamsPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Teams</h1>
          <p className="text-muted-foreground">
            Manage your team members and collaboration
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Team Management
            </CardTitle>
            <CardDescription>
              This feature is coming soon! You'll be able to manage team members, assign roles, and track collaboration.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Team Management Coming Soon</h3>
              <p className="text-muted-foreground">
                We're working on powerful team collaboration features including member management, role assignments, and real-time collaboration tools.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
