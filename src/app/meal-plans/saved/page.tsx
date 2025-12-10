'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Calculator, Trash2, ChevronDown, ChevronUp, Edit } from 'lucide-react';

interface SavedMealPlan {
  id: string;
  name: string;
  ingredients: Array<{
    name: string;
    quantity: string;
    unit: string;
  }>;
  servings?: number;
  createdAt: string;
  updatedAt?: string;
}

export default function SavedMealPlansPage() {
  const router = useRouter();
  const [mealPlans, setMealPlans] = useState<SavedMealPlan[]>([]);
  const [expandedPlanId, setExpandedPlanId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedPlanId(expandedPlanId === id ? null : id);
  };

  useEffect(() => {
    const savedPlans = localStorage.getItem('savedMealPlans');
    const demoPlansKey = 'hasAddedDemoPlans';
    
    // Check if we need to add demo plans
    if (!localStorage.getItem(demoPlansKey)) {
      const demoPlans: SavedMealPlan[] = [
        {
          id: 'demo1',
          name: 'Classic Spaghetti Bolognese',
          ingredients: [
            { name: 'Ground beef', quantity: '1', unit: 'lb' },
            { name: 'Spaghetti', quantity: '1', unit: 'lb' },
            { name: 'Tomato sauce', quantity: '24', unit: 'oz' },
            { name: 'Onion', quantity: '1', unit: 'item' },
            { name: 'Garlic', quantity: '3', unit: 'cloves' },
            { name: 'Olive oil', quantity: '2', unit: 'tbsp' },
            { name: 'Parmesan cheese', quantity: '0.5', unit: 'cup' }
          ],
          servings: 4,
          createdAt: new Date('2023-12-01').toISOString(),
          updatedAt: new Date('2023-12-01').toISOString()
        },
        {
          id: 'demo2',
          name: 'Vegetable Stir Fry',
          ingredients: [
            { name: 'Broccoli', quantity: '2', unit: 'cups' },
            { name: 'Bell peppers', quantity: '2', unit: 'item' },
            { name: 'Carrots', quantity: '2', unit: 'item' },
            { name: 'Snow peas', quantity: '1', unit: 'cup' },
            { name: 'Soy sauce', quantity: '3', unit: 'tbsp' },
            { name: 'Sesame oil', quantity: '1', unit: 'tbsp' },
            { name: 'Rice', quantity: '2', unit: 'cups' },
            { name: 'Tofu', quantity: '14', unit: 'oz' }
          ],
          servings: 3,
          createdAt: new Date('2023-12-05').toISOString(),
          updatedAt: new Date('2023-12-05').toISOString()
        },
        {
          id: 'demo3',
          name: 'Chicken Caesar Salad',
          ingredients: [
            { name: 'Chicken breast', quantity: '1.5', unit: 'lb' },
            { name: 'Romaine lettuce', quantity: '2', unit: 'heads' },
            { name: 'Parmesan cheese', quantity: '0.5', unit: 'cup' },
            { name: 'Croutons', quantity: '2', unit: 'cups' },
            { name: 'Caesar dressing', quantity: '0.5', unit: 'cup' },
            { name: 'Lemon', quantity: '1', unit: 'item' },
            { name: 'Black pepper', quantity: '1', unit: 'tsp' }
          ],
          servings: 4,
          createdAt: new Date('2023-12-08').toISOString(),
          updatedAt: new Date('2023-12-08').toISOString()
        }
      ];

      const allPlans = savedPlans 
        ? [...JSON.parse(savedPlans), ...demoPlans]
        : demoPlans;

      // Save the combined plans to localStorage and state
      localStorage.setItem('savedMealPlans', JSON.stringify(allPlans));
      localStorage.setItem(demoPlansKey, 'true');
      setMealPlans(allPlans);
    } else if (savedPlans) {
      // If we already have saved plans, just set them in state
      setMealPlans(JSON.parse(savedPlans));
    }
  }, []);

  const handleCalculateCost = (id: string) => {
    // Navigate to calculation page with the meal plan ID
    const plan = mealPlans.find(p => p.id === id);
    if (plan) {
      const queryParams = new URLSearchParams({
        name: plan.name,
        ingredients: JSON.stringify(plan.ingredients)
      });
      router.push(`/meal-plans/calculate/${id}?${queryParams}`);
    }
  };

  const handleEdit = (id: string) => {
    const plan = mealPlans.find(p => p.id === id);
    if (plan) {
      const queryParams = new URLSearchParams({
        edit: 'true',
        name: encodeURIComponent(plan.name),
        ingredients: encodeURIComponent(JSON.stringify(plan.ingredients)),
        servings: plan.servings ? plan.servings.toString() : ''
      });
      router.push(`/meal-plans?${queryParams}`);
    }
  };

  const handleDelete = (id: string) => {
    const updatedPlans = mealPlans.filter(plan => plan.id !== id);
    setMealPlans(updatedPlans);
    localStorage.setItem('savedMealPlans', JSON.stringify(updatedPlans));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link 
            href="/dashboard"
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Saved Meal Plans</h1>
          <Link
            href="/meal-plans"
            className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 flex items-center"
          >
            <Plus className="h-4 w-4 mr-1" /> New
          </Link>
        </div>

        <div className="space-y-4">
          {mealPlans.length > 0 ? (
            [...mealPlans]
              .sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime())
              .map((plan) => (
                <div key={plan.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex flex-col">
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <button 
                          onClick={() => toggleExpand(plan.id)}
                          className="text-left w-full flex items-center justify-between"
                        >
                          <div>
                            <h3 className="font-medium text-gray-900">{plan.name}</h3>
                            <p className="text-sm text-gray-500">
                              {plan.ingredients.length} ingredients • {formatDate(plan.updatedAt || plan.createdAt)}
                              {plan.servings && ` • ${plan.servings} servings`}
                            </p>
                          </div>
                          {expandedPlanId === plan.id ? (
                            <ChevronUp className="h-5 w-5 text-gray-500 ml-2" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-500 ml-2" />
                          )}
                        </button>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCalculateCost(plan.id);
                          }}
                          className="px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center"
                        >
                          <Calculator className="h-4 w-4 mr-1" />
                          Calculate Cost
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(plan.id);
                          }}
                          className="p-1.5 text-gray-400 hover:text-blue-500 rounded-full hover:bg-blue-50"
                          title="Edit meal plan"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(plan.id);
                          }}
                          className="p-1.5 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50"
                          title="Delete meal plan"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    {expandedPlanId === plan.id && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Ingredients:</h4>
                        <ul className="space-y-1.5">
                          {plan.ingredients.map((ingredient, idx) => (
                            <li key={idx} className="flex justify-between text-sm text-gray-600">
                              <span className="font-medium">{ingredient.name}</span>
                              <span>
                                {ingredient.quantity} {ingredient.unit}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No saved meal plans yet.</p>
              <Link
                href="/meal-plans"
                className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center mx-auto w-fit"
              >
                <Plus className="h-4 w-4 mr-1" />
                Create New Meal Plan
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
