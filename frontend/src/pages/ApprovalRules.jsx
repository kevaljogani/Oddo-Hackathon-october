import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Switch } from '../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Slider } from '../components/ui/slider';
import {
  Plus,
  Edit,
  Trash2,
  GripVertical,
  Users,
  FileText,
  Settings,
  ArrowUpDown
} from 'lucide-react';
import { mockApprovalRules, mockCategories, mockUsers } from '../data/mockData';
import { toast } from 'sonner';

/**
 * Approval rules management with drag & drop rule builder
 * Uses reactbits drag animations and form interactions
 */
const ApprovalRules = () => {
  const [rules, setRules] = useState(mockApprovalRules);
  const [selectedRule, setSelectedRule] = useState(null);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'ALL',
    sequential: true,
    minApprovalPercentage: 100,
    approvers: []
  });

  const availableApprovers = mockUsers.filter(user => 
    user.isManagerApprover && ['ADMIN', 'MANAGER'].includes(user.role)
  );

  const handleCreateRule = () => {
    setIsCreateMode(true);
    setSelectedRule(null);
    setFormData({
      name: '',
      category: 'ALL',
      sequential: true,
      minApprovalPercentage: 100,
      approvers: []
    });
  };

  const handleEditRule = (rule) => {
    setIsCreateMode(false);
    setSelectedRule(rule);
    setFormData({
      name: rule.name,
      category: rule.category,
      sequential: rule.sequential,
      minApprovalPercentage: rule.minApprovalPercentage,
      approvers: [...rule.approvers]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.approvers.length === 0) {
      toast.error('Please add at least one approver');
      return;
    }

    setLoading(true);

    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (isCreateMode) {
        const newRule = {
          id: `rule-${Date.now()}`,
          ...formData
        };
        setRules(prev => [...prev, newRule]);
        toast.success('Approval rule created successfully');
      } else {
        setRules(prev => prev.map(rule => 
          rule.id === selectedRule.id ? { ...rule, ...formData } : rule
        ));
        toast.success('Approval rule updated successfully');
      }

      setSelectedRule(null);
      setIsCreateMode(false);
    } catch (error) {
      toast.error('Failed to save approval rule');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRule = async (ruleId) => {
    if (!confirm('Are you sure you want to delete this rule?')) return;

    setLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setRules(prev => prev.filter(rule => rule.id !== ruleId));
      toast.success('Approval rule deleted successfully');
    } catch (error) {
      toast.error('Failed to delete rule');
    } finally {
      setLoading(false);
    }
  };

  const addApprover = (approverId) => {
    const approver = availableApprovers.find(a => a.id === approverId);
    if (approver && !formData.approvers.find(a => a.id === approverId)) {
      const newApprover = {
        id: approver.id,
        name: approver.name,
        order: formData.approvers.length + 1
      };
      setFormData(prev => ({
        ...prev,
        approvers: [...prev.approvers, newApprover]
      }));
    }
  };

  const removeApprover = (approverId) => {
    setFormData(prev => ({
      ...prev,
      approvers: prev.approvers.filter(a => a.id !== approverId)
        .map((approver, index) => ({ ...approver, order: index + 1 }))
    }));
  };

  const moveApprover = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= formData.approvers.length) return;

    const newApprovers = [...formData.approvers];
    const [moved] = newApprovers.splice(fromIndex, 1);
    newApprovers.splice(toIndex, 0, moved);
    
    // Update order numbers
    const reorderedApprovers = newApprovers.map((approver, index) => ({
      ...approver,
      order: index + 1
    }));

    setFormData(prev => ({ ...prev, approvers: reorderedApprovers }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Approval Rules</h1>
          <p className="text-gray-600 mt-1">
            Configure expense approval workflows and policies
          </p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button onClick={handleCreateRule} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Create Rule
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
            <DialogHeader>
              <DialogTitle>
                {isCreateMode ? 'Create Approval Rule' : 'Edit Approval Rule'}
              </DialogTitle>
              <DialogDescription>
                Define how expenses should be approved based on categories and amounts
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Rule Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Travel Expenses"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Applies To Category</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Categories</SelectItem>
                      {mockCategories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Approval Type */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Approval Type</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Sequential Approval</Label>
                      <p className="text-sm text-gray-500">
                        Approvers must approve in order vs. parallel approval
                      </p>
                    </div>
                    <Switch
                      checked={formData.sequential}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({ ...prev, sequential: checked }))
                      }
                    />
                  </div>

                  {!formData.sequential && (
                    <div className="space-y-2">
                      <Label>Minimum Approval Percentage: {formData.minApprovalPercentage}%</Label>
                      <Slider
                        value={[formData.minApprovalPercentage]}
                        onValueChange={(value) => 
                          setFormData(prev => ({ ...prev, minApprovalPercentage: value[0] }))
                        }
                        min={0}
                        max={100}
                        step={10}
                        className="w-full"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Approvers */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Approvers</CardTitle>
                  <CardDescription>
                    Add approvers {formData.sequential ? 'in order' : 'for parallel approval'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Add Approver */}
                  <div className="flex gap-2">
                    <Select onValueChange={addApprover}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select an approver to add" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableApprovers
                          .filter(approver => !formData.approvers.find(a => a.id === approver.id))
                          .map(approver => (
                            <SelectItem key={approver.id} value={approver.id}>
                              {approver.name} ({approver.role})
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Approvers List */}
                  <div className="space-y-2">
                    {formData.approvers.map((approver, index) => (
                      <div 
                        key={approver.id} 
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg animate-in fade-in slide-in-from-right-4"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex items-center gap-3">
                          {formData.sequential && (
                            <div className="flex flex-col gap-1">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => moveApprover(index, index - 1)}
                                disabled={index === 0}
                                className="h-6 w-6 p-0"
                              >
                                ↑
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => moveApprover(index, index + 1)}
                                disabled={index === formData.approvers.length - 1}
                                className="h-6 w-6 p-0"
                              >
                                ↓
                              </Button>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-2">
                            {formData.sequential && (
                              <Badge variant="outline" className="w-6 h-6 p-0 flex items-center justify-center">
                                {approver.order}
                              </Badge>
                            )}
                            <GripVertical className="h-4 w-4 text-gray-400" />
                            <span className="font-medium">{approver.name}</span>
                          </div>
                        </div>
                        
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeApprover(approver.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}

                    {formData.approvers.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        No approvers added yet. Select approvers from the dropdown above.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <DialogFooter>
                <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                  {loading ? 'Saving...' : (isCreateMode ? 'Create Rule' : 'Update Rule')}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Rules List */}
      <div className="grid gap-6">
        {rules.map((rule, index) => (
          <Card 
            key={rule.id} 
            className="hover:shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    {rule.name}
                  </CardTitle>
                  <CardDescription>
                    Applies to: {rule.category === 'ALL' ? 'All Categories' : rule.category}
                  </CardDescription>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge variant={rule.sequential ? 'default' : 'secondary'}>
                    {rule.sequential ? 'Sequential' : 'Parallel'}
                  </Badge>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditRule(rule)}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteRule(rule.id)}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                {/* Rule Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-500">Approval Type:</span>
                    <div className="flex items-center gap-2 mt-1">
                      {rule.sequential ? (
                        <ArrowUpDown className="h-4 w-4 text-blue-600" />
                      ) : (
                        <Users className="h-4 w-4 text-green-600" />
                      )}
                      <span>
                        {rule.sequential 
                          ? 'Sequential (one by one)' 
                          : `Parallel (${rule.minApprovalPercentage}% required)`}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <span className="font-medium text-gray-500">Approvers:</span>
                    <div className="mt-1">{rule.approvers.length} assigned</div>
                  </div>
                </div>

                {/* Approvers Flow */}
                <div>
                  <span className="font-medium text-gray-500 text-sm">Approval Flow:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {rule.approvers.map((approver, index) => (
                      <div key={approver.id} className="flex items-center gap-2">
                        <Badge variant="outline" className="flex items-center gap-1">
                          {rule.sequential && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-1 rounded">
                              {approver.order}
                            </span>
                          )}
                          {approver.name}
                        </Badge>
                        {rule.sequential && index < rule.approvers.length - 1 && (
                          <span className="text-gray-400">→</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {rules.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <div className="text-lg font-medium text-gray-900 mb-2">
                No approval rules configured
              </div>
              <div className="text-gray-500 mb-4">
                Create your first approval rule to automate expense approvals
              </div>
              <Button onClick={handleCreateRule}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Rule
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ApprovalRules;