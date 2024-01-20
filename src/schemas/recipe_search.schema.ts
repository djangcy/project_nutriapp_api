import { z } from 'zod';
import * as edamamTypes from './edamam_types';

/**
 * @openapi
 * 
 * components:
 *   parameters:
 *     RecipeSearchParamsType:
 *       in: query
 *       name: type
 *       schema:
 *         type: string
 *         enum:
 *           - public
 *           - private
 *           - any
 *         default: public
 *       description: Type of recipe (public, private, or any)
 *       
 *     RecipeSearchParamsQ:
 *       in: query
 *       name: q
 *       required: true
 *       schema:
 *         type: string
 *         minLength: 1
 *       description: Query string for recipe search

 *     RecipeSearchParamsFrom:
 *       in: query
 *       name: from
 *       schema:
 *         type: number
 *         format: int32
 *         minimum: 1
 *       description: Starting index for paginated results

 *     RecipeSearchParamsTo:
 *       in: query
 *       name: to
 *       schema:
 *         type: number
 *         format: int32
 *         minimum: 1
 *       description: Ending index for paginated results

 *     RecipeSearchParamsIngr:
 *       in: query
 *       name: ingr
 *       schema:
 *         type: number
 *         format: int32
 *         minimum: 1
 *       description: Minimum number of ingredients

 *     RecipeSearchParamsDiet:
 *       in: query
 *       name: diet
 *       schema:
 *         type: array
 *         items:
 *           type: string
 *           enum:
 *             - balanced
 *             - high-fiber
 *             - high-protein
 *             - low-carb
 *             - low-fat
 *             - low-sodium
 *       description: Diet type

 *     RecipeSearchParamsHealth:
 *       in: query
 *       name: health
 *       schema:
 *         type: array
 *         items:
 *           type: string
 *           enum:
 *             - alcohol-cocktail
 *             - alcohol-free
 *             - celery-free
 *             - crustacean-free
 *             - dairy-free
 *             - DASH
 *             - egg-free
 *             - fish-free
 *             - fodmap-free
 *             - gluten-free
 *             - immuno-supportive
 *             - keto-friendly
 *             - kidney-friendly
 *             - kosher
 *             - low-fat-abs
 *             - low-potassium
 *             - low-sugar
 *             - lupine-free
 *             - Medditerranean
 *             - mollusk-free
 *             - mustard-free
 *             - no-oil-added
 *             - paleo
 *             - peanut-free
 *             - pescetarian
 *             - pork-free
 *             - red-meat-free
 *             - sesame-free
 *             - shellfish-free
 *             - soy-free
 *             - sugar-conscious
 *             - sulfite-free
 *             - tree-nut-free
 *             - vegan
 *             - vegetarian
 *             - wheat-free
 *       description: Health label

 *     RecipeSearchParamsCuisineType:
 *       in: query
 *       name: cuisineType
 *       schema:
 *         type: array
 *         items:
 *           type: string
 *           enum:
 *             - American
 *             - Asian
 *             - British
 *             - Caribbean
 *             - Central Europe
 *             - Chinese
 *             - Eastern Europe
 *             - French
 *             - Indian
 *             - Italian
 *             - Japanese
 *             - Kosher
 *             - Mediterranean
 *             - Mexican
 *             - Middle Eastern
 *             - Nordic
 *             - South American
 *             - South East Asian
 *       description: Cuisine type

 *     RecipeSearchParamsMealType:
 *       in: query
 *       name: mealType
 *       schema:
 *         type: array
 *         items:
 *           type: string
 *           enum:
 *             - Breakfast
 *             - Dinner
 *             - Lunch
 *             - Snack
 *             - Teatime
 *       description: Meal type

 *     RecipeSearchParamsDishType:
 *       in: query
 *       name: dishType
 *       schema:
 *         type: array
 *         items:
 *           type: string
 *           enum:
 *             - Biscuit and cookies
 *             - Bread
 *             - Cereals
 *             - Condiments and sauces
 *             - Desserts
 *             - Drinks
 *             - Main course
 *             - Pancake
 *             - Preps
 *             - Preserve
 *             - Salad
 *             - Sandwiches
 *             - Side dish
 *             - Soup
 *             - Starter
 *             - Sweets
 *       description: Dish type

 *     RecipeSearchParamsCalories:
 *       in: query
 *       name: calories
 *       schema:
 *         type: string
 *       description: Caloric content filter

 *     RecipeSearchParamsTime:
 *       in: query
 *       name: time
 *       schema:
 *         type: string
 *       description: Time filter

 *     RecipeSearchParamsExcluded:
 *       in: query
 *       name: excluded
 *       schema:
 *         type: array
 *         items:
 *           type: string
 *       description: Excluded ingredients
*/

export const RecipeSearchSchema = z.object({
  type: z
    .string()
    .refine(
      (val: string) => val === 'public' || val === 'private' || val === 'any',
      {
        message: "'Type' must be 'public' or 'private' or 'any'",
      }
    )
    .default('public'),
  q: z
    .string({ invalid_type_error: 'query must be of type string' })
    .trim()
    .min(1, { message: 'query must not be empty' }), // isNotEmpty
  from: z
    .number()
    .int({ message: 'from must be an integer' })
    .positive({ message: 'from must be greater than 0' })
    .optional(),
  to: z
    .number()
    .int({ message: 'to must be an integer' })
    .positive({ message: 'to must be greater than 0' })
    .optional(),
  ingr: z
    .number()
    .int({ message: 'ingr must be an integer' })
    .positive({ message: 'ingr must be greater than 0' })
    .optional(),
  diet: z
    .string({ invalid_type_error: 'diet must be of type string[]' })
    .array()
    .refine(
      (values: string[]) => {
        return values.every((val) => edamamTypes.dietTypes.includes(val));
      },
      { message: 'diet includes an invalid value' }
    )
    .optional(),
  health: z
    .string({ invalid_type_error: 'health must be of type string[]' })
    .array()
    .refine(
      (values: string[]) => {
        return values.every((val) => edamamTypes.healthTypes.includes(val));
      },
      { message: 'health includes an invalid value' }
    )
    .optional(),
  cuisineType: z
    .string({ invalid_type_error: 'cuisineType must be of type string[]' })
    .array()
    .refine(
      (values: string[]) => {
        return values.every((val) => edamamTypes.cuisineTypes.includes(val));
      },
      { message: 'cuisineType includes an invalid value' }
    )
    .optional(),
  mealType: z
    .string({ invalid_type_error: 'mealType must be of type string[]' })
    .array()
    .refine(
      (values: string[]) => {
        return values.every((val) => edamamTypes.mealTypes.includes(val));
      },
      { message: 'mealType includes an invalid value' }
    )
    .optional(),
  dishType: z
    .string({ invalid_type_error: 'dishType must be of type string[]' })
    .array()
    .refine(
      (values: string[]) => {
        return values.every((val) => edamamTypes.dishTypes.includes(val));
      },
      { message: 'dishType includes an invalid value' }
    )
    .optional(),
  calories: z
    .string({ invalid_type_error: 'calories must be of type string' })
    .optional(),
  time: z
    .string({ invalid_type_error: 'time must be of type string' })
    .optional(),
  excluded: z
    .string({ invalid_type_error: 'excluded must be of type string[]' })
    .array()
    .optional(),
});
