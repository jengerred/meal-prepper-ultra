'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2, Calculator, Save } from 'lucide-react';

interface Ingredient {
  id: number;
  name: string;
  quantity: string;
  unit: string;
  price?: string; // Will be calculated based on store prices
}

type SavedMealPlan = {
  id: string;
  name: string;
  ingredients: Omit<Ingredient, 'id'>[];
  servings?: number;
  createdAt: string;
  updatedAt?: string;
};

// Local storage key
const MEAL_PLANS_KEY = 'savedMealPlans';

// Utility functions for localStorage operations
const saveMealPlanToStorage = (mealPlan: Omit<SavedMealPlan, 'id' | 'createdAt' | 'updatedAt'>): SavedMealPlan => {
  if (typeof window === 'undefined') return {} as SavedMealPlan;
  
  const newMealPlan: SavedMealPlan = {
    ...mealPlan,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  const existingPlans = getMealPlansFromStorage();
  const updatedPlans = [...existingPlans, newMealPlan];
  localStorage.setItem(MEAL_PLANS_KEY, JSON.stringify(updatedPlans));
  return newMealPlan;
};

const getMealPlansFromStorage = (): SavedMealPlan[] => {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem(MEAL_PLANS_KEY);
  return saved ? JSON.parse(saved) : [];
};

export default function NewMealPlanPage() {
  const router = useRouter();
  const [mealName, setMealName] = useState('');
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: 1, name: '', quantity: '', unit: 'lb' }
  ]);
  const [error, setError] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);

  // Read URL parameters when component mounts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const editParam = params.get('edit');
      
      if (editParam === 'true') {
        setIsEditMode(true);
        const name = params.get('name');
        const ingredientsParam = params.get('ingredients');
        const servings = params.get('servings');
        
        if (name) {
          setMealName(decodeURIComponent(name));
        }
        
        if (ingredientsParam) {
          try {
            const parsedIngredients = JSON.parse(decodeURIComponent(ingredientsParam));
            if (Array.isArray(parsedIngredients) && parsedIngredients.length > 0) {
              // Add unique IDs to each ingredient
              const ingredientsWithIds = parsedIngredients.map((ing: Omit<Ingredient, 'id'>, index: number) => ({
                ...ing,
                id: Date.now() + index // Generate unique IDs
              }));
              setIngredients(ingredientsWithIds);
            }
          } catch (error) {
            console.error('Error parsing ingredients:', error);
          }
        }

        // Set servings if available
        if (servings) {
          const servingsInput = document.querySelector<HTMLInputElement>('input[type="number"]');
          if (servingsInput) {
            servingsInput.value = servings;
          }
        }
      }
    }
  }, []);

  const addIngredient = () => {
    setIngredients([
      ...ingredients,
      { id: Date.now(), name: '', quantity: '', unit: 'lb' }
    ]);
  };

  const removeIngredient = (id: number) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter(ing => ing.id !== id));
    }
  };

  const updateIngredient = (id: number, field: keyof Ingredient, value: string) => {
    setIngredients(ingredients.map(ing => 
      ing.id === id ? { ...ing, [field]: value } : ing
    ));
  };

  const validateForm = (): boolean => {
    if (!mealName.trim()) {
      setError('Please enter a name for your meal plan');
      return false;
    }

    // Check if any ingredient has a name and quantity
    const hasValidIngredients = ingredients.some(
      ing => ing.name.trim() !== '' && ing.quantity.trim() !== ''
    );

    if (!hasValidIngredients) {
      setError('Please add at least one ingredient with both name and quantity');
      return false;
    }

    setError('');
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    // Save the meal plan to localStorage
    const servings = document.querySelector<HTMLInputElement>('input[type="number"]')?.value;
    
    const newMealPlan = saveMealPlanToStorage({
      name: mealName,
      ingredients: ingredients
        .filter(ing => ing.name.trim() !== '' && ing.quantity.trim() !== '')
        .map(({ id, ...rest }) => rest), // Remove the id since we'll generate a new one
      servings: servings ? parseInt(servings) : undefined
    });
    
    // Navigate to the saved plans page
    router.push('/meal-plans/saved');
  };

  const handleCalculateCost = () => {
    if (!validateForm()) return;
    
    // In a real app, you would save the meal plan first if it's new
    // For now, we'll use a temporary ID and pass the data in the URL
    const tempId = 'new';
    const queryParams = new URLSearchParams({
      name: mealName,
      ingredients: JSON.stringify(ingredients)
    });
    router.push(`/meal-plans/calculate/${tempId}?${queryParams}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Create Meal Plan</h1>
          <Link 
            href="/dashboard"
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
          </Link>
        </div>

        <form id="mealPlanForm" onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meal Plan Name</label>
                <input
                  type="text"
                  value={mealName}
                  onChange={(e) => setMealName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter meal plan name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Number of Servings</label>
                <input
                  type="number"
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter number of servings (optional)"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">Ingredients</h2>
                <button
                  type="button"
                  onClick={addIngredient}
                  className="text-sm text-green-600 hover:text-green-800 font-medium flex items-center"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Ingredient
                </button>
              </div>

              <div className="space-y-4">
                {ingredients.map((ingredient) => (
                  <div key={ingredient.id} className="grid grid-cols-12 gap-3 items-end">
                    <div className="col-span-5">
                      <label className="block text-xs text-gray-500 mb-1">Name</label>
                      <input
                        type="text"
                        value={ingredient.name}
                        onChange={(e) => updateIngredient(ingredient.id, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-sm"
                        placeholder="e.g., Chicken breast"
                        required
                      />
                    </div>
                    
                    <div className="col-span-2">
                      <label className="block text-xs text-gray-500 mb-1">Qty</label>
                      <input
                        type="number"
                        value={ingredient.quantity}
                        onChange={(e) => updateIngredient(ingredient.id, 'quantity', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-sm"
                        placeholder="0"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                    
                    <div className="col-span-2">
                      <label className="block text-xs text-gray-500 mb-1">Unit</label>
                      <select
                        value={ingredient.unit}
                        onChange={(e) => updateIngredient(ingredient.id, 'unit', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-sm bg-white"
                      >
                        <option value="lb">lb</option>
                        <option value="g">g</option>
                        <option value="kg">kg</option>
                        <option value="ml">ml</option>
                        <option value="L">L</option>
                        <option value="tsp">tsp</option>
                        <option value="tbsp">tbsp</option>
                        <option value="cup">cup</option>
                        <option value="item">item</option>
                      </select>
                    </div>
                    
                    <div className="col-span-1 flex justify-end">
                      <button
                        type="button"
                        onClick={() => removeIngredient(ingredient.id)}
                        className="text-gray-400 hover:text-red-500 p-1"
                        disabled={ingredients.length <= 1}
                        title={ingredients.length <= 1 ? "At least one ingredient is required" : "Remove ingredient"}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-end space-x-3">
            <button
              type="submit"
              className="px-6 py-2 rounded-md text-sm font-medium text-blue-600 bg-white border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
            >
              💾 Save Without Calculating
            </button>
            <button
              type="button"
              onClick={handleCalculateCost}
              className="px-6 py-2 rounded-md text-sm font-medium text-white bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center"
            >
              <Calculator className="h-4 w-4 mr-1" />
              Calculate/Compare Cost
            </button>
          </div>

          <div className="bg-gray-50 p-4 rounded-md mt-8">
            <div className="flex items-start">
              <svg className="h-5 w-5 text-yellow-400 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Tip:</span> We'll pull prices from Walmart, Kroger, and Costco to help you find the best deals for your ingredients.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}