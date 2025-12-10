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
      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome back, {session?.user?.name || 'User'}!</h1>
              <p className="text-gray-500">Location: Grand Rapids, MI</p>
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
      </div>

      {/* Main Content */}
      <main className="space-y-8 max-w-7xl mx-auto">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Average Cost per Serving */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Avg. Cost/Serving</p>
                <p className="text-2xl font-bold text-gray-900">$3.42</p>
                <p className="text-xs text-green-600 mt-1">↓ 12% from last month</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          {/* Total Meals Planned */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Meals Planned</p>
                <p className="text-2xl font-bold text-gray-900">24</p>
                <p className="text-xs text-blue-600 mt-1">+3 this week</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Estimated Monthly Savings */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Monthly Savings</p>
                <p className="text-2xl font-bold text-gray-900">$127.50</p>
                <p className="text-xs text-purple-600 mt-1">vs. average spending</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <BarChart2 className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Favorite Store */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Favorite Store</p>
                <p className="text-2xl font-bold text-gray-900">Meijer</p>
                <p className="text-xs text-gray-500 mt-1">Saves you ~15%</p>
              </div>
              <div className="p-3 bg-amber-100 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

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
                  <h3 className="font-medium text-gray-900">Create Meal Plan</h3>
                  <p className="text-sm text-gray-500">Calculate meal costs and compare prices</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Saved Meal Plans Card */}
          <Link 
            href="/meal-plans/saved" 
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