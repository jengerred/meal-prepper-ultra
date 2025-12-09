import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const meals = await db.meals.find();
    return NextResponse.json(meals);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch meals' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const newMeal = await db.meals.create(data);
    return NextResponse.json(newMeal, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create meal' },
      { status: 500 }
    );
  }
}
