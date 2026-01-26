import type { AuthUser } from "@/lib/authService"

export interface Recipe {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  prepTime: number; // minutos
  cookTime: number;
  servings: number;
  category: string;
  ingredients: Ingredient[];
  steps: Step[];
  authorId: string;
  author: AuthUser;
  ratings: Rating[];
  averageRating: number;
  createdAt: string;
  updatedAt: string;
}

export interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: string; // 'g', 'ml', 'xícara', 'colher'
}

export interface Step {
  id: string;
  order: number;
  instruction: string;
  timeMinutes?: number;
}

export interface Rating {
  id: string;
  userId: string;
  userName: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
}
