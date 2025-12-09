import mongoose, { ConnectOptions } from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

interface CachedMongoose {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: CachedMongoose;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

// Mock data
const mockMeals = [
  {
    id: '1',
    name: 'Avocado Toast',
    calories: 320,
    protein: 8,
    carbs: 35,
    fat: 18,
    ingredients: [
      'Whole grain bread',
      'Avocado',
      'Cherry tomatoes',
      'Olive oil',
      'Salt & pepper'
    ]
  },
  {
    id: '2',
    name: 'Chicken Salad',
    calories: 420,
    protein: 35,
    carbs: 12,
    fat: 25,
    ingredients: [
      'Grilled chicken breast',
      'Mixed greens',
      'Cherry tomatoes',
      'Cucumber',
      'Olive oil dressing'
    ]
  }
];

const mockDb = {
  meals: {
    find: async () => mockMeals,
    findById: async (id: string) => mockMeals.find(meal => meal.id === id),
    create: async (meal: any) => {
      const newMeal = { ...meal, id: Math.random().toString() };
      mockMeals.push(newMeal);
      return newMeal;
    }
  }
};

// Database connection handler
let db: any;

if (process.env.NODE_ENV === 'production' && process.env.MONGODB_URI) {
  // Production: Use real MongoDB
  const MONGODB_URI = process.env.MONGODB_URI;
  
  let cached = (global as any).mongoose;
  if (!cached) {
    cached = (global as any).mongoose = { conn: null, promise: null };
  }

  const dbConnect = async () => {
    if (cached.conn) {
      return cached.conn;
    }

    if (!cached.promise) {
      const opts = {
        bufferCommands: false,
      };

      cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
        return mongoose;
      });
    }

    try {
      cached.conn = await cached.promise;
    } catch (e) {
      cached.promise = null;
      throw e;
    }

    return cached.conn;
  };

  db = {
    ...mockDb,
    connect: dbConnect,
    connection: { readyState: 1 }
  };
} else {
  // Development: Use mock database
  console.log('Using mock database');
  db = {
    ...mockDb,
    connect: async () => ({
      connection: { readyState: 1 },
      close: () => Promise.resolve()
    }),
    connection: { readyState: 1 }
  };
}

export default db;
