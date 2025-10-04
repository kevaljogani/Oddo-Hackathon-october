import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import {
  CreditCard,
  Users,
  CheckCircle,
  BarChart3,
  Shield,
  Clock,
  ArrowRight,
  Sparkles
} from 'lucide-react';

/**
 * Landing page component with animated hero background using reactbits patterns
 * Features smooth animations and modern gradient designs
 */
const Landing = () => {
  // Features data
  const features = [
    {
      icon: CreditCard,
      title: 'Smart Expense Tracking',
      description: 'Capture receipts with OCR technology and automatically categorize expenses for faster processing.'
    },
    {
      icon: Users,
      title: 'Multi-level Approvals',
      description: 'Configure custom approval workflows with sequential or parallel approvers based on expense categories.'
    },
    {
      icon: BarChart3,
      title: 'Real-time Analytics',
      description: 'Get instant insights into spending patterns, budget utilization, and team expense trends.'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-level encryption and role-based access controls keep your financial data secure.'
    },
    {
      icon: Clock,
      title: 'Fast Reimbursements',
      description: 'Streamlined approval process reduces reimbursement time from weeks to days.'
    },
    {
      icon: CheckCircle,
      title: 'Compliance Ready',
      description: 'Built-in audit trails and policy enforcement ensure regulatory compliance.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated background effect - reactbits pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-600/20 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 rounded-full bg-gradient-to-br from-emerald-400/20 to-blue-600/20 blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-8 w-8 text-blue-400" />
          <span className="text-xl font-bold text-white">ExpenseFlow</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <Link to="/login">
            <Button variant="ghost" className="text-white hover:text-blue-400 hover:bg-white/10">
              Sign In
            </Button>
          </Link>
          <Link to="/signup">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
            Expense Management
            <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent block mt-2">
              Made Simple
            </span>
          </h1>
          
          <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Transform your expense reporting with intelligent automation, smart approvals, 
            and real-time insights that save time and reduce errors.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg group">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8 py-4 text-lg">
                Sign In
              </Button>
            </Link>
          </div>

          <div className="mt-16 text-center">
            <p className="text-slate-400 text-sm mb-8">Trusted by forward-thinking companies worldwide</p>
            <div className="flex items-center justify-center space-x-8 opacity-60">
              {/* Mock company logos */}
              <div className="h-8 w-24 bg-white/20 rounded"></div>
              <div className="h-8 w-24 bg-white/20 rounded"></div>
              <div className="h-8 w-24 bg-white/20 rounded"></div>
              <div className="h-8 w-24 bg-white/20 rounded"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 px-6 py-20 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">
              Everything you need for expense management
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              From receipt capture to final approval, streamline your entire expense workflow
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={index} 
                  className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105"
                >
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-emerald-400 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-white text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-slate-300 text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to transform your expense management?
          </h2>
          <p className="text-xl text-slate-300 mb-12">
            Join thousands of companies already saving time and money with ExpenseFlow
          </p>

          <Link to="/signup">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white px-12 py-4 text-lg">
              Get Started Today
            </Button>
          </Link>

          <div className="mt-8 text-slate-400 text-sm">
            No credit card required • Free 14-day trial • Cancel anytime
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center text-slate-400">
          <p>&copy; 2024 ExpenseFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;