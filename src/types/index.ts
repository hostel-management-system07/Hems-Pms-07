
export interface User {
  id: string;
  email: string;
  displayName: string;
  role: 'admin' | 'product_manager' | 'team_member' | 'stakeholder';
  avatar?: string;
  createdAt: Date;
  lastLogin: Date;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  sku: string;
  category: string;
  brand: string;
  price: number;
  stock: number;
  status: 'ideation' | 'design' | 'development' | 'launch' | 'retired';
  tags: string[];
  images: string[];
  specs: Record<string, any>;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  version: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo: string;
  productId?: string;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Roadmap {
  id: string;
  name: string;
  description: string;
  productId: string;
  milestones: Milestone[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Milestone {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: 'planned' | 'in_progress' | 'completed' | 'delayed';
  tasks: string[];
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  read: boolean;
}
