import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import {
  CreditCard,
  DollarSign,
  Clock,
  CheckCircle,
  Users,
  TrendingUp,
  Plus,
  ArrowUpRight,
  Calendar,
  FileText
} from 'lucide-react';
import { mockExpenses } from '../data/mockData';

/**
 * Dashboard component with animated cards and charts
 * Uses reactbits entry animation patterns for smooth reveal
 */
const Dashboard = () => {
  const { user, hasRole } = useAuth();

  // Calculate dashboard stats from mock data
  const pendingExpenses = mockExpenses.filter(exp => exp.status === 'PENDING').length;
  const totalAmount = mockExpenses.reduce((sum, exp) => sum + exp.convertedAmount, 0);
  const approvedExpenses = mockExpenses.filter(exp => exp.status === 'APPROVED').length;
  const rejectedExpenses = mockExpenses.filter(exp => exp.status === 'REJECTED').length;

  // Quick stats cards data
  const statsCards = [
    {
      title: 'Total Expenses',
      value: `$${totalAmount.toLocaleString()}`,
      description: 'This month',
      icon: DollarSign,
      trend: '+12%',
      color: 'blue'
    },
    {
      title: 'Pending Approval',
      value: pendingExpenses.toString(),
      description: 'Awaiting review',
      icon: Clock,
      trend: '-8%',
      color: 'orange'
    },
    {
      title: 'Approved',
      value: approvedExpenses.toString(),
      description: 'Ready for payment',
      icon: CheckCircle,
      trend: '+15%',
      color: 'green'
    }
  ];

  // Recent expenses for quick view
  const recentExpenses = mockExpenses.slice(0, 5);

  // Quick actions based on role
  const getQuickActions = () => {
    const actions = [
      {
        title: 'New Expense',
        description: 'Create a new expense report',
        href: '/expenses/new',
        icon: Plus,
        color: 'blue'
      }
    ];

    if (hasRole('MANAGER')) {
      actions.push({
        title: 'Review Approvals',
        description: 'Approve pending expenses',
        href: '/manager/approvals',
        icon: CheckCircle,
        color: 'green',
        badge: pendingExpenses
      });
    }

    if (hasRole('ADMIN')) {
      actions.push(
        {
          title: 'Manage Users',
          description: 'Add or edit team members',
          href: '/admin/users',
          icon: Users,
          color: 'purple'
        },
        {
          title: 'Company Settings',
          description: 'Configure expense policies',
          href: '/admin/settings',
          icon: FileText,
          color: 'gray'
        }
      );
    }

    return actions;
  };

  const quickActions = getQuickActions();

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name?.split(' ')[0]}!
          </h1>
          <p className="text-gray-600 mt-1">
            Here's what's happening with your expenses today
          </p>
        </div>
        <Link to="/expenses/new">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            New Expense
          </Button>
        </Link>
      </div>

      {/* Stats Cards - reactbits stagger animation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statsCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card 
              key={card.title} 
              className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02] animate-in fade-in slide-in-from-bottom-4"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {card.title}
                </CardTitle>
                <Icon className={`h-4 w-4 text-${card.color}-600`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{card.value}</div>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-gray-600">{card.description}</p>
                  <Badge variant={card.trend.startsWith('+') ? 'default' : 'secondary'} className="text-xs">
                    {card.trend}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <Card className="animate-in fade-in slide-in-from-left-4 duration-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link key={action.title} to={action.href}>
                  <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors group cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-${action.color}-100`}>
                        <Icon className={`h-5 w-5 text-${action.color}-600`} />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                          {action.title}
                        </div>
                        <div className="text-sm text-gray-600">{action.description}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {action.badge && (
                        <Badge variant="destructive">{action.badge}</Badge>
                      )}
                      <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </CardContent>
        </Card>

        {/* Recent Expenses */}
        <Card className="animate-in fade-in slide-in-from-right-4 duration-500">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Recent Expenses
                </CardTitle>
                <CardDescription>
                  Your latest expense reports
                </CardDescription>
              </div>
              <Link to="/expenses">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentExpenses.map((expense, index) => {
              const getStatusColor = (status) => {
                switch (status) {
                  case 'APPROVED': return 'bg-green-100 text-green-800';
                  case 'REJECTED': return 'bg-red-100 text-red-800';
                  case 'PENDING': return 'bg-yellow-100 text-yellow-800';
                  default: return 'bg-gray-100 text-gray-800';
                }
              };

              return (
                <Link key={expense.id} to={`/expenses/${expense.id}`}>
                  <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors group cursor-pointer">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                        {expense.title}
                      </div>
                      <div className="text-sm text-gray-600 flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        {new Date(expense.date).toLocaleDateString()}
                        <span>•</span>
                        <span>{expense.category}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="font-medium text-gray-900">
                          ${expense.convertedAmount.toLocaleString()}
                        </div>
                        <Badge className={`text-xs ${getStatusColor(expense.status)}`}>
                          {expense.status}
                        </Badge>
                      </div>
                      <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section - Charts/Analytics (placeholder for now) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <CardHeader>
            <CardTitle>Monthly Spending Trend</CardTitle>
            <CardDescription>Your expense patterns over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center text-gray-500">
                <TrendingUp className="h-12 w-12 mx-auto mb-2" />
                <p>Chart visualization coming soon</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
            <CardDescription>Expenses by category this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-2" />
                <p>Category analytics coming soon</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;