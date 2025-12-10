'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Trash2, Calculator } from 'lucide-react';

interface Ingredient {
  id: number;
  name: string;
  quantity: string;
  unit: string;
  price?: string; // Will be calculated based on store prices
}

export default function NewMealPlanPage() {
  const router = useRouter();
  const [mealName, setMealName] = useState('');
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: 1, name: '', quantity: '', unit: 'lb' }
  ]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Saving meal:', { mealName, ingredients });
    // In a real app, you would save to database and then navigate
    // For now, we'll just navigate to the calculation page
    handleCalculateCost();
  };

  const handleCalculateCost = () => {
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
        <button 
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
        </button>

        <h1 className="text-2xl font-bold text-gray-900 mb-8">Create New Meal Plan</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Meal Name</label>
              <input
                type="text"
                value={mealName}
                onChange={(e) => setMealName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                placeholder="e.g., Chicken Alfredo Pasta"
                required
              />
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

          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Cancel
            </button>
            <div className="space-x-3">
              <button
                type="button"
                onClick={handleCalculateCost}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
              >
                <Calculator className="h-4 w-4 mr-1" />
                Calculate Cost
              </button>
              <button
                type="submit"
                className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Save Meal Plan
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}