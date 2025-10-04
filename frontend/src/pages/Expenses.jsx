import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Calendar,
  DollarSign
} from 'lucide-react';
import { mockExpenses, mockCategories } from '../data/mockData';
import LoadingSkeleton from '../components/LoadingSkeleton';

/**
 * Expenses list page with filtering, search, and table animations
 * Uses reactbits table row hover and entrance animations
 */
const Expenses = () => {
  const [expenses] = useState(mockExpenses);
  const [filteredExpenses, setFilteredExpenses] = useState(mockExpenses);
  const [filters, setFilters] = useState({
    search: '',
    status: 'ALL',
    category: 'ALL',
    dateRange: 'ALL'
  });
  const [loading] = useState(false);

  // Apply filters whenever filter state changes
  React.useEffect(() => {
    let filtered = [...expenses];

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(expense =>
        expense.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        expense.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Status filter
    if (filters.status !== 'ALL') {
      filtered = filtered.filter(expense => expense.status === filters.status);
    }

    // Category filter
    if (filters.category !== 'ALL') {
      filtered = filtered.filter(expense => expense.category === filters.category);
    }

    setFilteredExpenses(filtered);
  }, [filters, expenses]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { variant: 'secondary', className: 'bg-yellow-100 text-yellow-800' },
      APPROVED: { variant: 'secondary', className: 'bg-green-100 text-green-800' },
      REJECTED: { variant: 'secondary', className: 'bg-red-100 text-red-800' },
      DRAFT: { variant: 'secondary', className: 'bg-gray-100 text-gray-800' }
    };
    
    const config = statusConfig[status] || statusConfig.DRAFT;
    return (
      <Badge variant={config.variant} className={config.className}>
        {status}
      </Badge>
    );
  };

  const canEdit = (expense) => {
    return expense.status === 'DRAFT' || expense.status === 'REJECTED';
  };

  const canDelete = (expense) => {
    return expense.status === 'DRAFT';
  };

  if (loading) {
    return <LoadingSkeleton type="table" />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Expenses</h1>
          <p className="text-gray-600 mt-1">
            Track and manage your expense reports
          </p>
        </div>
        <Link to="/expenses/new">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            New Expense
          </Button>
        </Link>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Expenses', value: expenses.length, icon: DollarSign },
          { label: 'Pending', value: expenses.filter(e => e.status === 'PENDING').length, icon: Calendar },
          { label: 'Approved', value: expenses.filter(e => e.status === 'APPROVED').length, icon: Calendar },
          { label: 'This Month', value: `$${expenses.reduce((sum, e) => sum + e.convertedAmount, 0).toLocaleString()}`, icon: DollarSign }
        ].map((stat, index) => (
          <Card key={stat.label} className="animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${index * 100}ms` }}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <stat.icon className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search expenses..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
              </SelectContent>
            </Select>

            {/* Category Filter */}
            <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Categories</SelectItem>
                {mockCategories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Expenses Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Current Approver</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExpenses.map((expense, index) => (
                <TableRow 
                  key={expense.id} 
                  className="hover:bg-gray-50 transition-colors animate-in fade-in slide-in-from-bottom-2"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <TableCell className="font-medium">
                    {new Date(expense.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Link to={`/expenses/${expense.id}`} className="hover:text-blue-600 transition-colors">
                      <div className="font-medium">{expense.title}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {expense.description}
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{expense.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        ${expense.convertedAmount.toLocaleString()}
                      </div>
                      {expense.originalCurrency !== 'USD' && (
                        <div className="text-sm text-gray-500">
                          {expense.originalAmount} {expense.originalCurrency}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(expense.status)}
                  </TableCell>
                  <TableCell>
                    {expense.currentApprover ? (
                      <div className="text-sm">John Manager</div>
                    ) : (
                      <span className="text-gray-400 text-sm">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link to={`/expenses/${expense.id}`} className="flex items-center gap-2">
                            <Eye className="h-4 w-4" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        {canEdit(expense) && (
                          <DropdownMenuItem asChild>
                            <Link to={`/expenses/${expense.id}/edit`} className="flex items-center gap-2">
                              <Edit className="h-4 w-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                        )}
                        {canDelete(expense) && (
                          <DropdownMenuItem className="flex items-center gap-2 text-red-600">
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredExpenses.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500">
                No expenses found matching your criteria.
              </div>
              <Link to="/expenses/new" className="inline-block mt-4">
                <Button variant="outline">Create Your First Expense</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Expenses;