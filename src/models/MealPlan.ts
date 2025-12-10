import mongoose, { Document, Schema } from 'mongoose';

export interface IIngredient {
  name: string;
  quantity: number;
  unit: string;
  price?: number;
  store?: string;
  storeUrl?: string;
}

export interface INutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface IMeal {
  id: string;
  name: string;
  description?: string;
  ingredients: IIngredient[];
  instructions: string[];
  prepTime: number; // in minutes
  cookTime: number; // in minutes
  servings: number;
  nutrition?: INutrition;
}

export interface IDailyMeals {
  breakfast?: IMeal;
  lunch?: IMeal;
  dinner?: IMeal;
  snacks?: IMeal[];
}

export interface IMealPlan extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  meals: {
    [day: string]: IDailyMeals;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ingredientSchema = new Schema<IIngredient>({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true },
  price: { type: Number },
  store: { type: String },
  storeUrl: { type: String },
});

const nutritionSchema = new Schema<INutrition>({
  calories: { type: Number, required: true },
  protein: { type: Number, required: true },
  carbs: { type: Number, required: true },
  fat: { type: Number, required: true }
});

const mealSchema = new Schema<IMeal>({
  name: { type: String, required: true },
  description: String,
  ingredients: [ingredientSchema],
  instructions: [{ type: String }],
  prepTime: { type: Number, required: true },
  cookTime: { type: Number, required: true },
  servings: { type: Number, required: true },
  nutrition: nutritionSchema
});

const dailyMealsSchema = new Schema<IDailyMeals>({
  breakfast: mealSchema,
  lunch: mealSchema,
  dinner: mealSchema,
  snacks: [mealSchema]
});

const mealPlanSchema = new Schema<IMealPlan>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: String,
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  meals: {
    type: Map,
    of: dailyMealsSchema,
    default: {}
  }
}, { timestamps: true });

const MealPlan = mongoose.models.MealPlan || mongoose.model<IMealPlan>('MealPlan', mealPlanSchema);

export default MealPlan;
