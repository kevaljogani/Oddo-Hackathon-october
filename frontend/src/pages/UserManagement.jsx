import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Checkbox } from '../components/ui/checkbox';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Users,
  UserPlus,
  Shield,
  MoreHorizontal,
  Upload
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { mockUsers } from '../data/mockData';
import { toast } from 'sonner';

/**
 * User management page for admin users with CRUD operations
 * Uses reactbits table animations and form modals
 */
const UserManagement = () => {
  const [users, setUsers] = useState(mockUsers);
  const [filteredUsers, setFilteredUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'EMPLOYEE',
    isManagerApprover: false,
    managerId: ''
  });

  // Filter users based on search
  React.useEffect(() => {
    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const handleCreateUser = () => {
    setIsCreateMode(true);
    setSelectedUser(null);
    setFormData({
      name: '',
      email: '',
      role: 'EMPLOYEE',
      isManagerApprover: false,
      managerId: ''
    });
  };

  const handleEditUser = (user) => {
    setIsCreateMode(false);
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      isManagerApprover: user.isManagerApprover,
      managerId: user.managerId || ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (isCreateMode) {
        const newUser = {
          id: `user-${Date.now()}`,
          ...formData,
          companyId: 'company-1'
        };
        setUsers(prev => [...prev, newUser]);
        toast.success('User created successfully');
      } else {
        setUsers(prev => prev.map(user => 
          user.id === selectedUser.id ? { ...user, ...formData } : user
        ));
        toast.success('User updated successfully');
      }

      setSelectedUser(null);
      setIsCreateMode(false);
    } catch (error) {
      toast.error('Failed to save user');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    setLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setUsers(prev => prev.filter(user => user.id !== userId));
      toast.success('User deleted successfully');
    } catch (error) {
      toast.error('Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      ADMIN: { variant: 'default', className: 'bg-purple-100 text-purple-800' },
      MANAGER: { variant: 'secondary', className: 'bg-blue-100 text-blue-800' },
      EMPLOYEE: { variant: 'outline', className: 'bg-gray-100 text-gray-800' }
    };
    
    const config = roleConfig[role] || roleConfig.EMPLOYEE;
    return (
      <Badge variant={config.variant} className={config.className}>
        {role}
      </Badge>
    );
  };

  const availableManagers = users.filter(user => 
    ['ADMIN', 'MANAGER'].includes(user.role) && user.id !== selectedUser?.id
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">
            Manage team members and their permissions
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import CSV
          </Button>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button onClick={handleCreateUser} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </DialogTrigger>
            
            <DialogContent className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <DialogHeader>
                <DialogTitle>
                  {isCreateMode ? 'Create User' : 'Edit User'}
                </DialogTitle>
                <DialogDescription>
                  {isCreateMode ? 'Add a new team member to your organization' : 'Update user information and permissions'}
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter full name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter email address"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select 
                    value={formData.role} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EMPLOYEE">Employee</SelectItem>
                      <SelectItem value="MANAGER">Manager</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.role !== 'ADMIN' && (
                  <div className="space-y-2">
                    <Label>Manager</Label>
                    <Select 
                      value={formData.managerId} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, managerId: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select manager" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableManagers.map(manager => (
                          <SelectItem key={manager.id} value={manager.id}>
                            {manager.name} ({manager.role})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isManagerApprover"
                    checked={formData.isManagerApprover}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, isManagerApprover: checked }))
                    }
                  />
                  <Label htmlFor="isManagerApprover" className="text-sm">
                    Can approve expenses
                  </Label>
                </div>

                <DialogFooter>
                  <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                    {loading ? 'Saving...' : (isCreateMode ? 'Create User' : 'Update User')}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: users.length, icon: Users },
          { label: 'Admins', value: users.filter(u => u.role === 'ADMIN').length, icon: Shield },
          { label: 'Managers', value: users.filter(u => u.role === 'MANAGER').length, icon: UserPlus },
          { label: 'Employees', value: users.filter(u => u.role === 'EMPLOYEE').length, icon: Users }
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

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Search Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Manager</TableHead>
                <TableHead>Approver</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user, index) => {
                const manager = users.find(u => u.id === user.managerId);
                
                return (
                  <TableRow 
                    key={user.id} 
                    className="hover:bg-gray-50 transition-colors animate-in fade-in slide-in-from-bottom-2"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="font-medium">{user.name}</div>
                      </div>
                    </TableCell>
                    
                    <TableCell>{user.email}</TableCell>
                    
                    <TableCell>
                      {getRoleBadge(user.role)}
                    </TableCell>
                    
                    <TableCell>
                      {manager ? manager.name : '-'}
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center">
                        <Checkbox 
                          checked={user.isManagerApprover} 
                          disabled 
                          className="pointer-events-none"
                        />
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Active
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <Dialog>
                            <DialogTrigger asChild>
                              <DropdownMenuItem 
                                onSelect={(e) => e.preventDefault()}
                                onClick={() => handleEditUser(user)}
                                className="flex items-center gap-2"
                              >
                                <Edit className="h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                            </DialogTrigger>
                          </Dialog>
                          
                          <DropdownMenuItem 
                            onClick={() => handleDeleteUser(user.id)}
                            className="flex items-center gap-2 text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <div className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'No users found' : 'No users yet'}
              </div>
              <div className="text-gray-500 mb-4">
                {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first team member'}
              </div>
              {!searchTerm && (
                <Button onClick={handleCreateUser}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First User
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;