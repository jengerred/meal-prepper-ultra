import mongoose, { Document, Schema } from 'mongoose';

export interface IIngredient {
  name: string;
  quantity: number;
  unit: string;
  price?: number;
  store?: string;
  storeUrl?: string;
}

export interface IMealPlan extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  ingredients: IIngredient[];
  servings: number;
  totalCost?: number;
  costPerServing?: number;
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

const mealPlanSchema = new Schema<IMealPlan>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    ingredients: [ingredientSchema],
    servings: { type: Number, required: true, min: 1 },
    totalCost: { type: Number, min: 0 },
    costPerServing: { type: Number, min: 0 },
  },
  { timestamps: true }
);

const MealPlan = mongoose.models.MealPlan || mongoose.model<IMealPlan>('MealPlan', mealPlanSchema);

export default MealPlan;
