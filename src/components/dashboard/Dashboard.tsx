
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';
import { Product, Task } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, Package, Users, Plus, ArrowRight, CheckCircle, Clock } from 'lucide-react';

export function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProjects: 0,
    pendingTasks: 0,
    teamMembers: 0,
  });
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [userTasks, setUserTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // Fetch products count
      const productsSnapshot = await getDocs(collection(db, 'products'));
      const totalProducts = productsSnapshot.size;

      // Fetch recent products (limit 3)
      const recentProductsQuery = query(
        collection(db, 'products'),
        orderBy('createdAt', 'desc'),
        limit(3)
      );
      const recentProductsSnapshot = await getDocs(recentProductsQuery);
      const productsList = recentProductsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Product));

      // Fetch user's tasks
      const userTasksQuery = query(
        collection(db, 'tasks'),
        where('assignedTo', '==', user!.id),
        orderBy('createdAt', 'desc'),
        limit(3)
      );
      const userTasksSnapshot = await getDocs(userTasksQuery);
      const tasksList = userTasksSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Task));

      // Fetch all tasks for admin stats
      const allTasksSnapshot = await getDocs(collection(db, 'tasks'));
      const allTasks = allTasksSnapshot.docs.map(doc => doc.data() as Task);
      const pendingTasks = allTasks.filter(task => 
        ['todo', 'in_progress'].includes(task.status)
      ).length;

      // Fetch team members count
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const teamMembers = usersSnapshot.size;

      setStats({
        totalProducts,
        activeProjects: Math.floor(totalProducts * 0.7), // Estimate active projects
        pendingTasks: user!.role === 'admin' ? pendingTasks : tasksList.filter(task => 
          ['todo', 'in_progress'].includes(task.status)
        ).length,
        teamMembers,
      });

      setRecentProducts(productsList);
      setUserTasks(tasksList);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = user?.role === 'admin';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl font-bold">Welcome back, {user?.displayName}!</h1>
        <p className="text-muted-foreground">
          Here's what's happening with your products today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              Products in system
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeProjects}</div>
            <p className="text-xs text-muted-foreground">
              Currently in development
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isAdmin ? 'Pending Tasks' : 'My Tasks'}
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingTasks}</div>
            <p className="text-xs text-muted-foreground">
              {isAdmin ? 'Tasks in progress' : 'Tasks assigned to you'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.teamMembers}</div>
            <p className="text-xs text-muted-foreground">
              Active team members
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks you can perform</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {isAdmin && (
            <Button onClick={() => navigate('/products/new')} className="h-auto p-4 flex flex-col items-center space-y-2">
              <Plus className="h-6 w-6" />
              <span>New Product</span>
            </Button>
          )}
          <Button onClick={() => navigate('/analytics')} variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
            <BarChart3 className="h-6 w-6" />
            <span>View Analytics</span>
          </Button>
          <Button onClick={() => navigate('/teams')} variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
            <Users className="h-6 w-6" />
            <span>Manage Team</span>
          </Button>
          <Button onClick={() => navigate('/feedback')} variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
            <Package className="h-6 w-6" />
            <span>Customer Feedback</span>
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Products */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Products</CardTitle>
              <CardDescription>Latest products added to the system</CardDescription>
            </div>
            <Link to="/products">
              <Button variant="ghost" size="sm">
                View all <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentProducts.length === 0 ? (
              <div className="text-center py-6">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-muted-foreground">No products yet.</p>
                {isAdmin && (
                  <Button onClick={() => navigate('/products/new')} className="mt-2">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {recentProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <h4 className="font-medium">{product.name}</h4>
                      <p className="text-sm text-muted-foreground">{product.category}</p>
                    </div>
                    <div className="text-sm font-medium">${product.price}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>{isAdmin ? 'Recent Tasks' : 'My Tasks'}</CardTitle>
            <CardDescription>
              {isAdmin ? 'Latest tasks and their status' : 'Tasks assigned to you'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {userTasks.length === 0 ? (
              <div className="text-center py-6">
                <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {isAdmin ? 'No tasks yet.' : 'No tasks assigned to you yet.'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {userTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <h4 className="font-medium">{task.title}</h4>
                      <p className="text-sm text-muted-foreground capitalize">{task.status.replace('_', ' ')}</p>
                    </div>
                    <div className={`text-xs px-2 py-1 rounded ${
                      task.priority === 'high' ? 'bg-red-100 text-red-800' :
                      task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {task.priority}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
