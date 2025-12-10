'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  Calculator, 
  BookOpen, 
  Settings, 
  DollarSign, 
  BarChart2, 
  Save, 
  LogOut,
  ChevronRight
} from 'lucide-react';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    } else if (status === 'authenticated') {
      setIsLoading(false);
    }
  }, [status, router]);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      {/* Header */}
      <header className="mb-10">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, {session?.user?.name || 'User'}!</h1>
            <p className="text-gray-500">Location: Detroit, MI</p>
          </div>
          <button 
            onClick={handleLogout}
            className="px-4 py-2 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200 flex items-center transition-colors"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="space-y-8 max-w-7xl mx-auto">
        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Cost Optimizer Card */}
          <div className="bg-green-600 text-white p-6 rounded-xl hover:shadow-lg transition-all duration-300">
            <DollarSign className="h-8 w-8 mb-4" />
            <h3 className="text-xl font-bold mb-2">Cost Optimizer</h3>
            <p className="text-green-100">Find the best prices across stores</p>
          </div>

          {/* Smart Calculations Card */}
          <div className="bg-blue-600 text-white p-6 rounded-xl hover:shadow-lg transition-all duration-300">
            <BarChart2 className="h-8 w-8 mb-4" />
            <h3 className="text-xl font-bold mb-2">Smart Calculations</h3>
            <p className="text-blue-100">Accurate cost per serving analysis</p>
          </div>

          {/* Save Plans Card */}
          <div className="bg-purple-600 text-white p-6 rounded-xl hover:shadow-lg transition-all duration-300">
            <Save className="h-8 w-8 mb-4" />
            <h3 className="text-xl font-bold mb-2">Save Plans</h3>
            <p className="text-purple-100">Store and reuse your meal plans</p>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Calculate Meal Cost Card */}
          <Link 
            href="/meal-plans" 
            className="group bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 h-full block"
          >
            <div className="flex justify-between items-center h-full">
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-lg mr-4 group-hover:bg-green-50 transition-colors">
                  <Calculator className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Calculate Meal Cost</h3>
                  <p className="text-sm text-gray-500">Create a new meal plan and compare prices</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Saved Meal Plans Card */}
          <Link 
            href="/meal-plans" 
            className="group bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 h-full block"
          >
            <div className="flex justify-between items-center h-full">
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-lg mr-4 group-hover:bg-blue-50 transition-colors">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Saved Meal Plans</h3>
                  <p className="text-sm text-gray-500">View and recalculate your saved plans</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Account Settings Card */}
          <Link 
            href="/settings" 
            className="group bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 h-full block"
          >
            <div className="flex justify-between items-center h-full">
              <div className="flex items-center">
                <div className="bg-purple-100 p-3 rounded-lg mr-4 group-hover:bg-purple-50 transition-colors">
                  <Settings className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Account Settings</h3>
                  <p className="text-sm text-gray-500">Manage your profile and preferences</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>

        {/* How It Works Section */}
        <div className="bg-purple-600 text-white p-6 rounded-xl hover:shadow-lg transition-all duration-300">
          <h2 className="text-xl font-bold mb-4">How It Works</h2>
          <ol className="space-y-3 list-decimal list-inside">
            <li>Create a new meal plan or select a saved one</li>
            <li>Add your recipes and ingredients</li>
            <li>Get instant cost analysis and price comparisons</li>
            <li>Save and share your optimized meal plans</li>
          </ol>
        </div>
      </main>
    </div>
  );
}