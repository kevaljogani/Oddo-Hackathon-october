import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Separator } from '../components/ui/separator';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Upload,
  FileText,
  Scan,
  DollarSign,
  Calendar,
  Building2
} from 'lucide-react';
import { mockExpenses, mockCategories, mockCurrencies } from '../data/mockData';
import { toast } from 'sonner';

/**
 * Expense form for creating/editing expenses with multi-line items and file upload
 * Uses reactbits form animations and micro-interactions
 */
const ExpenseForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    category: '',
    currency: 'USD',
    lines: [{ description: '', amount: '' }],
    attachments: []
  });

  const [loading, setLoading] = useState(false);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Load expense data if editing
  useEffect(() => {
    if (isEditing) {
      const expense = mockExpenses.find(exp => exp.id === id);
      if (expense) {
        setFormData({
          title: expense.title,
          description: expense.description,
          date: expense.date,
          category: expense.category,
          currency: expense.originalCurrency,
          lines: expense.lines || [{ description: expense.title, amount: expense.originalAmount }],
          attachments: expense.attachments || []
        });
      }
    }
  }, [id, isEditing]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleLineChange = (index, field, value) => {
    const newLines = [...formData.lines];
    newLines[index] = { ...newLines[index], [field]: value };
    setFormData(prev => ({ ...prev, lines: newLines }));
  };

  const addLine = () => {
    setFormData(prev => ({
      ...prev,
      lines: [...prev.lines, { description: '', amount: '' }]
    }));
  };

  const removeLine = (index) => {
    if (formData.lines.length > 1) {
      const newLines = formData.lines.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, lines: newLines }));
    }
  };

  const handleFileUpload = (files) => {
    const newAttachments = Array.from(files).map(file => ({
      id: `att-${Date.now()}-${Math.random()}`,
      filename: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file) // Mock URL for preview
    }));

    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...newAttachments]
    }));
  };

  const removeAttachment = (attachmentId) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter(att => att.id !== attachmentId)
    }));
  };

  const handleOCR = async () => {
    if (formData.attachments.length === 0) {
      toast.error('Please upload a receipt first');
      return;
    }

    setOcrLoading(true);
    try {
      // Mock OCR processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock OCR results
      const ocrResult = {
        title: 'Business Dinner',
        amount: 125.50,
        date: new Date().toISOString().split('T')[0],
        merchant: 'Restaurant ABC',
        items: [
          { description: 'Appetizers', amount: 25.00 },
          { description: 'Main courses', amount: 80.50 },
          { description: 'Tax & tip', amount: 20.00 }
        ]
      };

      setFormData(prev => ({
        ...prev,
        title: ocrResult.title,
        date: ocrResult.date,
        lines: ocrResult.items
      }));

      toast.success('Receipt scanned successfully! Please review and edit the extracted information.');
    } catch (error) {
      toast.error('OCR processing failed');
    } finally {
      setOcrLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    const hasValidLines = formData.lines.some(line => 
      line.description.trim() && line.amount && parseFloat(line.amount) > 0
    );

    if (!hasValidLines) {
      newErrors.lines = 'At least one expense item is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (isDraft = false) => {
    if (!isDraft && !validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const status = isDraft ? 'DRAFT' : 'PENDING';
      const message = isDraft ? 
        'Expense saved as draft' : 
        isEditing ? 'Expense updated successfully' : 'Expense submitted for approval';

      toast.success(message);
      navigate('/expenses');
    } catch (error) {
      toast.error('Failed to save expense');
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = formData.lines.reduce((sum, line) => 
    sum + (parseFloat(line.amount) || 0), 0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditing ? 'Edit Expense' : 'New Expense'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEditing ? 'Update your expense details' : 'Create a new expense report'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="Enter expense title"
                  className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Enter expense description"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Date *
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleChange('date', e.target.value)}
                    className={errors.date ? 'border-red-500' : ''}
                  />
                  {errors.date && <p className="text-sm text-red-500">{errors.date}</p>}
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Category *
                  </Label>
                  <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
                    <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockCategories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Currency
                  </Label>
                  <Select value={formData.currency} onValueChange={(value) => handleChange('currency', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {mockCurrencies.map(currency => (
                        <SelectItem key={currency.code} value={currency.code}>
                          {currency.symbol} {currency.code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Expense Lines */}
          <Card>
            <CardHeader>
              <CardTitle>Expense Items</CardTitle>
              <CardDescription>Add individual items for this expense</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.lines.map((line, index) => (
                <div 
                  key={index} 
                  className="flex gap-4 items-end animate-in fade-in slide-in-from-left-4"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex-1 space-y-2">
                    <Label>Description</Label>
                    <Input
                      value={line.description}
                      onChange={(e) => handleLineChange(index, 'description', e.target.value)}
                      placeholder="Item description"
                    />
                  </div>
                  <div className="w-32 space-y-2">
                    <Label>Amount</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={line.amount}
                      onChange={(e) => handleLineChange(index, 'amount', e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeLine(index)}
                    disabled={formData.lines.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              {errors.lines && <p className="text-sm text-red-500">{errors.lines}</p>}
              
              <Button type="button" variant="outline" onClick={addLine} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>

              <Separator />

              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total Amount:</span>
                <span>{mockCurrencies.find(c => c.code === formData.currency)?.symbol || '$'}{totalAmount.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Attachments */}
          <Card>
            <CardHeader>
              <CardTitle>Attachments</CardTitle>
              <CardDescription>Upload receipts and supporting documents</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">Drag & drop files here, or click to select</p>
                <Input
                  type="file"
                  multiple
                  accept="image/*,.pdf"
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="hidden"
                  id="file-upload"
                />
                <Label htmlFor="file-upload">
                  <Button variant="outline" size="sm" asChild>
                    <span>Choose Files</span>
                  </Button>
                </Label>
              </div>

              {formData.attachments.length > 0 && (
                <div className="space-y-2">
                  {formData.attachments.map((attachment) => (
                    <div key={attachment.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <span className="text-sm truncate">{attachment.filename}</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAttachment(attachment.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <Button
                type="button"
                variant="outline"
                onClick={handleOCR}
                disabled={ocrLoading || formData.attachments.length === 0}
                className="w-full"
              >
                <Scan className="h-4 w-4 mr-2" />
                {ocrLoading ? 'Scanning...' : 'Scan Receipt (OCR)'}
              </Button>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={() => handleSubmit(true)}
                variant="outline"
                disabled={loading}
                className="w-full"
              >
                Save as Draft
              </Button>
              
              <Button
                onClick={() => handleSubmit(false)}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {loading ? 'Submitting...' : 'Submit for Approval'}
              </Button>
              
              <p className="text-xs text-gray-500 text-center">
                Drafts can be edited later. Submitted expenses enter the approval workflow.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ExpenseForm;