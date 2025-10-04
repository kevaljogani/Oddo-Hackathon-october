import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Textarea } from '../components/ui/textarea';
import { Separator } from '../components/ui/separator';
import {
  ArrowLeft,
  Edit,
  Download,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Calendar,
  Building2,
  User
} from 'lucide-react';
import { mockExpenses } from '../data/mockData';
import { toast } from 'sonner';

/**
 * Expense detail page with approval timeline and comment functionality
 * Uses reactbits reveal animations for timeline items
 */
const ExpenseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  // Find expense by ID (in real app, this would be from API)
  const expense = mockExpenses.find(exp => exp.id === id);

  if (!expense) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Expense not found</p>
        <Link to="/expenses">
          <Button variant="outline" className="mt-4">Back to Expenses</Button>
        </Link>
      </div>
    );
  }

  // Mock approval timeline
  const approvalTimeline = [
    {
      id: 1,
      approver: 'John Manager',
      role: 'Direct Manager',
      status: 'APPROVED',
      comment: 'Approved for business necessity',
      timestamp: '2024-01-16T10:30:00Z'
    },
    {
      id: 2,
      approver: 'Finance Team',
      role: 'Finance Approver',
      status: 'PENDING',
      comment: null,
      timestamp: null
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleApproval = async (decision) => {
    setLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(`Expense ${decision.toLowerCase()} successfully`);
      navigate('/manager/approvals');
    } catch (error) {
      toast.error('Failed to process approval');
    } finally {
      setLoading(false);
    }
  };

  const handleCommentSubmit = async () => {
    if (!comment.trim()) return;
    
    setLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast.success('Comment added successfully');
      setComment('');
    } catch (error) {
      toast.error('Failed to add comment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{expense.title}</h1>
            <p className="text-gray-600 mt-1">Expense Details</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {(expense.status === 'DRAFT' || expense.status === 'REJECTED') && (
            <Link to={`/expenses/${expense.id}/edit`}>
              <Button variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </Link>
          )}
          {expense.status === 'PENDING' && (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => handleApproval('REJECTED')}
                disabled={loading}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </Button>
              <Button 
                onClick={() => handleApproval('APPROVED')}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Expense Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status and Basic Info */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Expense Information</CardTitle>
                <Badge className={getStatusColor(expense.status)}>
                  {expense.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium">{new Date(expense.date).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Category</p>
                    <p className="font-medium">{expense.category}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Amount</p>
                    <p className="font-medium">${expense.convertedAmount.toLocaleString()}</p>
                    {expense.originalCurrency !== 'USD' && (
                      <p className="text-sm text-gray-500">
                        {expense.originalAmount} {expense.originalCurrency} @ {expense.exchangeRate}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Submitted by</p>
                    <p className="font-medium">Jane Employee</p>
                  </div>
                </div>
              </div>

              {expense.description && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">Description</p>
                    <p className="text-gray-900">{expense.description}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Expense Lines */}
          {expense.lines && expense.lines.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Expense Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {expense.lines.map((line, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">{line.description}</span>
                      <span className="font-medium">${line.amount.toFixed(2)}</span>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex justify-between items-center font-semibold text-lg">
                    <span>Total</span>
                    <span>${expense.convertedAmount.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Attachments */}
          {expense.attachments && expense.attachments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Attachments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {expense.attachments.map((attachment) => (
                    <div key={attachment.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FileText className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">{attachment.filename}</p>
                            <p className="text-sm text-gray-500">PDF Document</p>
                          </div>
                        </div>
                        <Button variant="outline" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Approval Timeline and Comments */}
        <div className="space-y-6">
          {/* Approval Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Approval Timeline</CardTitle>
              <CardDescription>Track the approval progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {approvalTimeline.map((step, index) => (
                  <div 
                    key={step.id} 
                    className="flex gap-3 animate-in fade-in slide-in-from-right-4"
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        step.status === 'APPROVED' ? 'bg-green-100 text-green-600' :
                        step.status === 'REJECTED' ? 'bg-red-100 text-red-600' :
                        step.status === 'PENDING' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-gray-100 text-gray-400'
                      }`}>
                        {step.status === 'APPROVED' ? <CheckCircle className="h-4 w-4" /> :
                         step.status === 'REJECTED' ? <XCircle className="h-4 w-4" /> :
                         step.status === 'PENDING' ? <Clock className="h-4 w-4" /> :
                         <User className="h-4 w-4" />}
                      </div>
                      {index < approvalTimeline.length - 1 && (
                        <div className="w-px h-8 bg-gray-200 mt-2" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-900">{step.approver}</p>
                        <Badge variant="outline" className="text-xs">
                          {step.role}
                        </Badge>
                      </div>
                      {step.timestamp && (
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(step.timestamp).toLocaleString()}
                        </p>
                      )}
                      {step.comment && (
                        <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-2 rounded">
                          {step.comment}
                        </p>
                      )}
                      {step.status === 'PENDING' && (
                        <p className="text-sm text-yellow-600 mt-2">Waiting for approval...</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Comments Section */}
          <Card>
            <CardHeader>
              <CardTitle>Comments</CardTitle>
              <CardDescription>Add notes and communicate about this expense</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea
                  placeholder="Add a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                />
                <Button 
                  onClick={handleCommentSubmit}
                  disabled={!comment.trim() || loading}
                  size="sm"
                  className="w-full"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Add Comment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ExpenseDetail;