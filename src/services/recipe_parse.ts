import { zodErrorToString } from '../helpers/zod_error_to_string';
import RecipeData from '../models/recipe_data';
import RecipeParse from '../repositories/gpt_recipe_parse';
import RecipeSearch from '../repositories/recipe_search';
import { RecipeSearchSchema } from '../schemas/recipe_search.schema';
import AppError from '../utils/app_error';

interface RecipeParseResult {
  value: any;
  prompt: string;
}

class RecipeParseService {
  static parseRecipeFromText = async (
    text: string
  ): Promise<RecipeParseResult> => {
    const resultModel = await new RecipeParse().parseRecipeFromText(text);

    const data: RecipeData = JSON.parse(resultModel.value);

    const options = RecipeSearchSchema.safeParse({
      q: data.ingredients?.join(', ').toString(),
      diet: data.diet,
      health: data.health,
      cuisineType: data.cuisineType,
      mealType: data.mealType,
      calories: data.calories?.toString(),
      time: data.time?.toString(),
    });

    if (!options.success) {
      throw AppError.badRequest(zodErrorToString(options.error));
    }

    const result = await RecipeSearch.getAll(options.data);

    return {
      prompt: resultModel.prompt,
      value: result,
    };
  };
}

export default RecipeParseService;
