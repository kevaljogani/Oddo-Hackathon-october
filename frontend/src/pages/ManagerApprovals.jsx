import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import {
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Eye,
  User,
  DollarSign,
  Calendar
} from 'lucide-react';
import { mockExpenses } from '../data/mockData';
import { toast } from 'sonner';

/**
 * Manager approvals queue with bulk actions and approval modal
 * Uses reactbits table animations and modal transitions
 */
const ManagerApprovals = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  // Filter pending expenses for manager approval
  const pendingExpenses = mockExpenses.filter(expense => expense.status === 'PENDING');
  
  const filteredExpenses = pendingExpenses.filter(expense =>
    expense.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expense.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApproval = async (expenseId, decision) => {
    setLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(`Expense ${decision.toLowerCase()} successfully`);
      setSelectedExpense(null);
      setComment('');
    } catch (error) {
      toast.error('Failed to process approval');
    } finally {
      setLoading(false);
    }
  };

  const getDaysPending = (date) => {
    const expenseDate = new Date(date);
    const today = new Date();
    const diffTime = today - expenseDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getUrgencyBadge = (days) => {
    if (days > 7) return { variant: 'destructive', text: `${days} days` };
    if (days > 3) return { variant: 'secondary', text: `${days} days`, className: 'bg-yellow-100 text-yellow-800' };
    return { variant: 'secondary', text: `${days} days`, className: 'bg-green-100 text-green-800' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pending Approvals</h1>
          <p className="text-gray-600 mt-1">
            Review and approve team expense reports
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">{pendingExpenses.length}</div>
          <div className="text-sm text-gray-600">Pending Items</div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Pending',
            value: pendingExpenses.length,
            icon: Clock,
            color: 'blue'
          },
          {
            label: 'Total Amount',
            value: `$${pendingExpenses.reduce((sum, e) => sum + e.convertedAmount, 0).toLocaleString()}`,
            icon: DollarSign,
            color: 'green'
          },
          {
            label: 'Urgent (>7 days)',
            value: pendingExpenses.filter(e => getDaysPending(e.date) > 7).length,
            icon: Calendar,
            color: 'red'
          },
          {
            label: 'Team Members',
            value: new Set(pendingExpenses.map(e => e.userId)).size,
            icon: User,
            color: 'purple'
          }
        ].map((stat, index) => (
          <Card key={stat.label} className="animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${index * 100}ms` }}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 text-${stat.color}-600`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Approvals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Approvals Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Days Pending</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExpenses.map((expense, index) => {
                const daysPending = getDaysPending(expense.date);
                const urgencyBadge = getUrgencyBadge(daysPending);
                
                return (
                  <TableRow 
                    key={expense.id} 
                    className="hover:bg-gray-50 transition-colors animate-in fade-in slide-in-from-bottom-2"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium">Jane Employee</div>
                          <div className="text-sm text-gray-500">employee@company.com</div>
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div>
                        <div className="font-medium">{expense.title}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {expense.description}
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        {new Date(expense.date).toLocaleDateString()}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="font-medium">${expense.convertedAmount.toLocaleString()}</div>
                      {expense.originalCurrency !== 'USD' && (
                        <div className="text-sm text-gray-500">
                          {expense.originalAmount} {expense.originalCurrency}
                        </div>
                      )}
                    </TableCell>
                    
                    <TableCell>
                      <Badge variant={urgencyBadge.variant} className={urgencyBadge.className}>
                        {urgencyBadge.text}
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Link to={`/expenses/${expense.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                        </Link>
                        
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm"
                              onClick={() => setSelectedExpense(expense)}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              Review
                            </Button>
                          </DialogTrigger>
                          
                          <DialogContent className="max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <DialogHeader>
                              <DialogTitle>Review Expense</DialogTitle>
                              <DialogDescription>
                                Review and approve or reject this expense report
                              </DialogDescription>
                            </DialogHeader>
                            
                            {selectedExpense && (
                              <div className="space-y-6">
                                {/* Expense Details */}
                                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                                  <div>
                                    <Label className="text-sm font-medium text-gray-500">Title</Label>
                                    <p className="font-medium">{selectedExpense.title}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium text-gray-500">Amount</Label>
                                    <p className="font-medium">${selectedExpense.convertedAmount.toLocaleString()}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium text-gray-500">Date</Label>
                                    <p className="font-medium">{new Date(selectedExpense.date).toLocaleDateString()}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium text-gray-500">Category</Label>
                                    <p className="font-medium">{selectedExpense.category}</p>
                                  </div>
                                </div>
                                
                                {selectedExpense.description && (
                                  <div>
                                    <Label className="text-sm font-medium text-gray-500">Description</Label>
                                    <p className="mt-1">{selectedExpense.description}</p>
                                  </div>
                                )}

                                {/* Expense Items */}
                                {selectedExpense.lines && selectedExpense.lines.length > 0 && (
                                  <div>
                                    <Label className="text-sm font-medium text-gray-500">Items</Label>
                                    <div className="mt-2 space-y-2">
                                      {selectedExpense.lines.map((line, index) => (
                                        <div key={index} className="flex justify-between p-2 bg-gray-50 rounded">
                                          <span>{line.description}</span>
                                          <span className="font-medium">${line.amount.toFixed(2)}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Comment */}
                                <div className="space-y-2">
                                  <Label htmlFor="comment">Comment</Label>
                                  <Textarea
                                    id="comment"
                                    placeholder="Add a comment (required for rejection)"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    rows={3}
                                  />
                                </div>
                              </div>
                            )}
                            
                            <DialogFooter className="gap-2">
                              <Button
                                variant="outline"
                                onClick={() => handleApproval(selectedExpense?.id, 'REJECTED')}
                                disabled={loading}
                                className="text-red-600 border-red-200 hover:bg-red-50"
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Reject
                              </Button>
                              <Button
                                onClick={() => handleApproval(selectedExpense?.id, 'APPROVED')}
                                disabled={loading}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Approve
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {filteredExpenses.length === 0 && (
            <div className="text-center py-12">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <div className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'No matching approvals' : 'All caught up!'}
              </div>
              <div className="text-gray-500">
                {searchTerm ? 'Try adjusting your search terms' : 'No pending approvals at the moment'}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ManagerApprovals;