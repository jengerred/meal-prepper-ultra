'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Ingredient {
  id: number;
  name: string;
  quantity: string;
  unit: string;
}

interface MealPlanData {
  name: string;
  ingredients: Ingredient[];
}

interface IngredientPrice extends Ingredient {
  prices: {
    walmart: string;
    kroger: string;
    costco: string;
  };
  bestDeal: 'walmart' | 'kroger' | 'costco';
  numericPrices: {
    walmart: number;
    kroger: number;
    costco: number;
  };
}

export default function CostComparisonPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mealPlan, setMealPlan] = useState<MealPlanData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [ingredientsWithPrices, setIngredientsWithPrices] = useState<IngredientPrice[]>([]);
  const [stores, setStores] = useState<Array<{
    name: string;
    total: string;
    perServing: string;
    isBestDeal: boolean;
  }>>([]);
  const [bestDeal, setBestDeal] = useState<{
    name: string;
    total: string;
    perServing: string;
  } | null>(null);

  // Calculate prices when mealPlan changes
  useEffect(() => {
    if (!mealPlan) return;

    // Function to generate a random price for an ingredient
    const generateRandomPrice = (base: number, variation: number) => 
      (base * (1 + (Math.random() * variation * 2 - variation))).toFixed(2);

    // Calculate prices for each ingredient
    const calculatedIngredients = mealPlan.ingredients.map(ingredient => {
      // Generate random prices for each store
      const walmartPrice = parseFloat(generateRandomPrice(3, 0.5));
      const krogerPrice = parseFloat(generateRandomPrice(3.5, 0.6));
      const costcoPrice = parseFloat(generateRandomPrice(2.8, 0.4));

      // Determine which store has the best price
      const prices = [
        { store: 'walmart', price: walmartPrice },
        { store: 'kroger', price: krogerPrice },
        { store: 'costco', price: costcoPrice }
      ];

      const bestDeal = prices.reduce((min, current) => 
        current.price < min.price ? current : prices[0]
      );

      return {
        ...ingredient,
        prices: {
          walmart: `$${walmartPrice.toFixed(2)} ($${walmartPrice.toFixed(2)}/${ingredient.unit})`,
          kroger: `$${krogerPrice.toFixed(2)} ($${krogerPrice.toFixed(2)}/${ingredient.unit})`,
          costco: `$${costcoPrice.toFixed(2)} ($${costcoPrice.toFixed(2)}/${ingredient.unit})`,
        },
        bestDeal: bestDeal.store as 'walmart' | 'kroger' | 'costco',
        numericPrices: {
          walmart: walmartPrice,
          kroger: krogerPrice,
          costco: costcoPrice
        }
      };
    });

    setIngredientsWithPrices(calculatedIngredients);

    // Calculate store totals
    const storeTotals = calculatedIngredients.reduce(
      (totals, ingredient) => ({
        walmart: totals.walmart + ingredient.numericPrices.walmart,
        kroger: totals.kroger + ingredient.numericPrices.kroger,
        costco: totals.costco + ingredient.numericPrices.costco
      }),
      { walmart: 0, kroger: 0, costco: 0 }
    );

    const servings = 4; // Default number of servings
    const storeData = [
      { 
        name: 'Walmart', 
        total: storeTotals.walmart, 
        perServing: storeTotals.walmart / servings,
        isBestDeal: false 
      },
      { 
        name: 'Kroger', 
        total: storeTotals.kroger, 
        perServing: storeTotals.kroger / servings,
        isBestDeal: false 
      },
      { 
        name: 'Costco', 
        total: storeTotals.costco, 
        perServing: storeTotals.costco / servings,
        isBestDeal: true 
      }
    ];

    // Find the best deal
    const bestDealStore = storeData.reduce((min, current) => 
      current.total < min.total ? current : storeData[0]
    );
    
    const storesWithBestDeal = storeData.map(store => ({
      ...store,
      isBestDeal: store.name === bestDealStore.name,
      total: `$${store.total.toFixed(2)}`,
      perServing: `$${store.perServing.toFixed(2)}`
    }));

    setStores(storesWithBestDeal);
    setBestDeal({
      name: bestDealStore.name,
      total: bestDealStore.total.toFixed(2),
      perServing: bestDealStore.perServing.toFixed(2)
    });

  }, [mealPlan]);

  // Parse the meal plan data from URL parameters
  useEffect(() => {
    const name = searchParams.get('name');
    const ingredientsParam = searchParams.get('ingredients');
    
    if (name && ingredientsParam) {
      try {
        const ingredients = JSON.parse(ingredientsParam);
        setMealPlan({ name, ingredients });
      } catch (error) {
        console.error('Error parsing ingredients:', error);
      }
    }
    setIsLoading(false);
  }, [searchParams]);

  if (isLoading || !stores.length) {
    return <div className="min-h-screen flex items-center justify-center">Loading store data...</div>;
  }

  if (!mealPlan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Meal Plan Not Found</h1>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Dashboard
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center">
            <Save className="h-4 w-4 mr-1" /> Save Plan
          </button>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Cost Comparison Results</h1>
        <p className="text-gray-600 mb-8">Meal Plan: {mealPlan?.name || 'Unnamed Meal Plan'}</p>

        {/* Best Deal Banner */}
        {bestDeal && (
          <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-6 rounded-lg mb-8">
            <h2 className="text-xl font-bold mb-2">Best Deal: {bestDeal.name}</h2>
            <p className="text-lg mb-2">
              Total: {bestDeal.total} • Cost per serving: {bestDeal.perServing}
            </p>
            <p>Shopping at {bestDeal.name} will save you the most money for this meal plan!</p>
          </div>
        )}

        {/* Store Price Comparison */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Store Price Comparison</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stores.map((store) => (
              <div
                key={store.name}
                className={`bg-white p-6 rounded-lg shadow-sm border-2 ${
                  store.isBestDeal ? 'border-green-500' : 'border-gray-200'
                }`}
              >
                {store.isBestDeal && (
                  <span className="bg-green-500 text-white text-xs font-medium px-2.5 py-0.5 rounded-full mb-2 inline-block">
                    Best Deal
                  </span>
                )}
                <h3 className="text-lg font-semibold mb-2">{store.name}</h3>
                <p className="text-gray-700">Total Cost: {store.total}</p>
                <p className="text-gray-700">Cost per Serving: {store.perServing}</p>
                <p className="text-gray-700">Servings: 4</p>
              </div>
            ))}
          </div>
        </div>

        {/* Ingredient Price Breakdown */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Ingredient Price Breakdown</h2>
          <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ingredient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Walmart
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kroger
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Costco
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {ingredientsWithPrices.map((ingredient, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {ingredient.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {ingredient.quantity} {ingredient.unit}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm ${
                        ingredient.bestDeal === 'walmart' ? 'text-green-600 font-semibold' : 'text-gray-500'
                      }`}
                    >
                      {ingredient.prices.walmart}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm ${
                        ingredient.bestDeal === 'kroger' ? 'text-green-600 font-semibold' : 'text-gray-500'
                      }`}
                    >
                      {ingredient.prices.kroger}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm ${
                        ingredient.bestDeal === 'costco' ? 'text-green-600 font-semibold' : 'text-gray-500'
                      }`}
                    >
                      {ingredient.prices.costco}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td colSpan={2} className="px-6 py-3 text-sm font-medium text-gray-900">
                    Total
                  </td>
                  {stores[0] && (
                    <td className="px-6 py-3 text-sm font-medium text-gray-900">
                      {stores[0].total}
                    </td>
                  )}
                  {stores[1] && (
                    <td className="px-6 py-3 text-sm font-medium text-gray-900">
                      {stores[1].total}
                    </td>
                  )}
                  {stores[2] && (
                    <td className="px-6 py-3 text-sm font-medium text-gray-900">
                      {stores[2].total}
                    </td>
                  )}
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
