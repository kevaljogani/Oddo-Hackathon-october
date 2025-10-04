import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Label } from '../components/ui/label';
import { Separator } from '../components/ui/separator';
import {
  Building,
  Globe,
  DollarSign,
  RefreshCw,
  Save,
  Database,
  Shield
} from 'lucide-react';
import { mockCompanySettings, mockCurrencies } from '../data/mockData';
import { toast } from 'sonner';

/**
 * Company settings page for admin configuration
 * Uses reactbits form animations and save interactions
 */
const CompanySettings = () => {
  const [settings, setSettings] = useState(mockCompanySettings);
  const [loading, setLoading] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  const timezones = [
    { value: 'America/New_York', label: 'Eastern Time (ET)' },
    { value: 'America/Chicago', label: 'Central Time (CT)' },
    { value: 'America/Denver', label: 'Mountain Time (MT)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
    { value: 'Europe/London', label: 'London (GMT)' },
    { value: 'Europe/Paris', label: 'Paris (CET)' },
    { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
    { value: 'Asia/Singapore', label: 'Singapore (SGT)' }
  ];

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setLastSaved(new Date());
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshRates = async () => {
    setLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newUpdateTime = new Date().toISOString();
      setSettings(prev => ({ ...prev, lastExchangeRateUpdate: newUpdateTime }));
      toast.success('Exchange rates updated successfully');
    } catch (error) {
      toast.error('Failed to update exchange rates');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Company Settings</h1>
          <p className="text-gray-600 mt-1">
            Configure your organization's expense management preferences
          </p>
        </div>
        
        <Button onClick={handleSave} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
          <Save className="h-4 w-4 mr-2" />
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {lastSaved && (
        <div className="text-sm text-green-600 bg-green-50 p-3 rounded-lg border border-green-200">
          Settings last saved: {lastSaved.toLocaleString()}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Company Information */}
        <Card className="animate-in fade-in slide-in-from-left-4 duration-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Company Information
            </CardTitle>
            <CardDescription>
              Basic information about your organization
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={settings.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Enter company name"
              />
            </div>

            <div className="space-y-2">
              <Label>Default Currency</Label>
              <Select 
                value={settings.defaultCurrency} 
                onValueChange={(value) => handleChange('defaultCurrency', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {mockCurrencies.map(currency => (
                    <SelectItem key={currency.code} value={currency.code}>
                      <div className="flex items-center gap-2">
                        <span>{currency.symbol}</span>
                        <span>{currency.code} - {currency.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500">
                All expenses will be converted to this currency for reporting
              </p>
            </div>

            <div className="space-y-2">
              <Label>Timezone</Label>
              <Select 
                value={settings.timezone} 
                onValueChange={(value) => handleChange('timezone', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timezones.map(tz => (
                    <SelectItem key={tz.value} value={tz.value}>
                      {tz.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Financial Settings */}
        <Card className="animate-in fade-in slide-in-from-right-4 duration-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Financial Settings
            </CardTitle>
            <CardDescription>
              Currency and exchange rate configuration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium">Exchange Rates</div>
                <div className="text-sm text-gray-500">
                  Last updated: {new Date(settings.lastExchangeRateUpdate).toLocaleString()}
                </div>
              </div>
              <Button 
                variant="outline" 
                onClick={handleRefreshRates}
                disabled={loading}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Update Now
              </Button>
            </div>

            <Separator />

            <div className="space-y-3">
              <h4 className="font-medium">Current Exchange Rates</h4>
              <div className="space-y-2">
                {mockCurrencies.slice(0, 4).map(currency => (
                  <div key={currency.code} className="flex justify-between text-sm">
                    <span>{currency.code} ({currency.name})</span>
                    <span className="font-mono">
                      {currency.code === settings.defaultCurrency ? '1.0000' : 
                       currency.code === 'EUR' ? '0.8500' :
                       currency.code === 'GBP' ? '0.7800' :
                       currency.code === 'JPY' ? '110.25' : '75.50'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data & Storage */}
        <Card className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Data & Storage
            </CardTitle>
            <CardDescription>
              Manage data retention and storage settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">2.3 GB</div>
                <div className="text-sm text-blue-600">Storage Used</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">98%</div>
                <div className="text-sm text-green-600">Backup Health</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Expense reports</span>
                <span className="text-sm text-gray-500">1,247 files</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Receipts & attachments</span>
                <span className="text-sm text-gray-500">3,892 files</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">User data</span>
                <span className="text-sm text-gray-500">45 profiles</span>
              </div>
            </div>

            <Button variant="outline" className="w-full">
              <Database className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security & Compliance
            </CardTitle>
            <CardDescription>
              Security policies and compliance settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Two-Factor Authentication</div>
                  <div className="text-sm text-gray-500">Required for admin users</div>
                </div>
                <div className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                  Enabled
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Session Timeout</div>
                  <div className="text-sm text-gray-500">Auto logout after inactivity</div>
                </div>
                <div className="text-sm font-medium">4 hours</div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Audit Logging</div>
                  <div className="text-sm text-gray-500">Track all user actions</div>
                </div>
                <div className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                  Active
                </div>
              </div>
            </div>

            <Button variant="outline" className="w-full">
              <Shield className="h-4 w-4 mr-2" />
              Security Settings
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Integration Settings */}
      <Card className="animate-in fade-in slide-in-from-bottom-4 duration-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Integrations
          </CardTitle>
          <CardDescription>
            Connect with external services and APIs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Accounting Software',
                description: 'Sync with QuickBooks, Xero, or SAP',
                status: 'Connected',
                color: 'green'
              },
              {
                name: 'Bank Integration',
                description: 'Real-time transaction matching',
                status: 'Not Connected',
                color: 'gray'
              },
              {
                name: 'Travel Booking',
                description: 'Import expenses from travel platforms',
                status: 'Available',
                color: 'blue'
              }
            ].map((integration, index) => (
              <div 
                key={integration.name} 
                className="p-4 border rounded-lg hover:shadow-md transition-shadow animate-in fade-in slide-in-from-bottom-2"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{integration.name}</h4>
                  <div className={`px-2 py-1 rounded text-xs ${
                    integration.color === 'green' ? 'bg-green-100 text-green-800' :
                    integration.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {integration.status}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  {integration.description}
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  {integration.status === 'Connected' ? 'Configure' : 'Connect'}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanySettings;