'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Calculator, Trash2 } from 'lucide-react';

// Mock data - replace with actual data from your database
const mockMealPlans = [
  { id: 1, name: 'Chicken Alfredo Pasta', ingredients: 5, date: '2023-11-15' },
  { id: 2, name: 'Vegetable Stir Fry', ingredients: 8, date: '2023-11-10' },
  { id: 3, name: 'Beef Tacos', ingredients: 6, date: '2023-11-05' },
];

export default function SavedMealPlansPage() {
  const router = useRouter();
  const [mealPlans, setMealPlans] = useState(mockMealPlans);

  const handleCalculateCost = (id: number) => {
    // Navigate to calculation page with the meal plan ID
    router.push(`/meal-plans/calculate/${id}`);
  };

  const handleDelete = (id: number) => {
    // In a real app, you would call an API to delete the meal plan
    setMealPlans(mealPlans.filter(plan => plan.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <button 
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Saved Meal Plans</h1>
          <div className="w-24"></div> {/* Spacer for alignment */}
        </div>

        <div className="space-y-4">
          {mealPlans.length > 0 ? (
            mealPlans.map((plan) => (
              <div key={plan.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-gray-900">{plan.name}</h3>
                    <p className="text-sm text-gray-500">{plan.ingredients} ingredients • {plan.date}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleCalculateCost(plan.id)}
                      className="px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center"
                    >
                      <Calculator className="h-4 w-4 mr-1" />
                      Calculate Cost
                    </button>
                    <button
                      onClick={() => handleDelete(plan.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50"
                      title="Delete meal plan"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No saved meal plans yet.</p>
              <button
                onClick={() => router.push('/meal-plans')}
                className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center mx-auto"
              >
                <Plus className="h-4 w-4 mr-1" />
                Create New Meal Plan
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
