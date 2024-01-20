export interface EdamamRecipe {
  uri: string;
  label: string;
  image: string;
  source: string;
  recipeUrl: string;
  servings: number;
  dietLabels: string[];
  healthLabels: string[];
  cautions: string[];
  ingredientLines: string[];
  ingredients: any[];
  calories: number;
  totalWeight: number;
  totalTime: number;
  cuisineType: string[];
  mealType: string[];
  dishType: string[];
  totalNutrients: any;
  instructionLines: string[];
}
