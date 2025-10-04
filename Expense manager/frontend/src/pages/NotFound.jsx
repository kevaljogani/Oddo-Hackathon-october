import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';

/**
 * 404 Not Found page with friendly message and navigation
 */
const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <div className="text-center max-w-md mx-auto">
        {/* Animated 404 */}
        <div className="text-8xl font-bold text-white mb-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          4<span className="text-blue-400 animate-pulse">0</span>4
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          Page Not Found
        </h1>
        
        <p className="text-slate-300 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-900">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-4 duration-1100">
          <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Link>
          </Button>
          
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link to="/dashboard" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;