import OpenAI, { OpenAIError } from 'openai';
import AppError from '../utils/app_error';
import Config from '../config';

const GPT_CONTENT =
  'The user will provide a natural-language query. Use the following step-by-step instructions to respond to user inputs.\n\nStep 1: Gather keywords from the query and sort them into the following fields:\n{ingredients: string[], diet: string[], cuisineType: string[], mealType: string[], calories: number, time: number, health: string[]}.\n\nStep 2: Create a json object as described in step 1, based on this list of valid keywords for each field:\n* diet: ["balanced", "high-fiber", "high-protein", "low-carb", "low-fat", "low-sodium"]\n* health: ["alcohol-cocktail", "alcohol-free", "celery-free", "crustacean-free", "dairy-free", "DASH", "egg-free", "fish-free", "fodmap-free", "gluten-free", "immuno-supportive", "keto-friendly", "kidney-friendly", "kosher", "low-fat-abs", "low-potassium", "low-sugar", "lupine-free", "Medditerranean", "mollusk-free", "mustard-free", "no-oil-added", "paleo", "peanut-free", "pescetarian", "pork-free", "red-meat-free", "sesame-free", "shellfish-free", "soy-free", "sugar-conscious", "sulfite-free", "tree-nut-free", "vegan", "vegetarian", "wheat-free"]\n* cuisineType: ["American", "Asian", "British", "Caribbean", "Central Europe", "Chinese", "Eastern Europe", "French", "Indian", "Italian", "Japanese", "Kosher", "Mediterranean", "Mexican", "Middle Eastern", "Nordic", "South American", "South East Asian"]\n* mealType: ["Breakfast", "Dinner", "Lunch", "Snack", "Teatime"]\n* dishType: ["Biscuit and cookies", "Bread", "Cereals", "Condiments and sauces", "Desserts", "Drinks", "Main course", "Pancake", "Preps", "Preserve", "Salad", "Sandwiches", "Side dish", "Soup", "Starter", "Sweets"]\n\nStep 3: Ensure that your response includes at least 2 appropriate values for \'ingredients\'.\n\nStep 4: Ensure that your response is formatted as a json object as defined in step 1, and only contains keywords that were defined in step 2. Do not respond with a sentence. Remove all newline characters from your response.\n\nStep 5: Exclude any fields will undefined or 0 values.';

interface RecipeParseResult {
  prompt: string;
  value: string;
}

class RecipeParse {
  public parseRecipeFromText = async (
    text: string
  ): Promise<RecipeParseResult> => {
    try {
      const openai = new OpenAI({
        apiKey: Config.openApiKey,
      });

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: GPT_CONTENT,
          },
          {
            role: 'user',
            content: text,
          },
        ],
        temperature: 1,
        max_tokens: 1024,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });

      return {
        prompt: text,
        value: response.choices[0].message.content ?? '',
      };
    } catch (error) {
      if (error instanceof OpenAIError) {
        throw AppError.internal({
          message: error.message,
          isOperational: false,
          stack: error.stack ?? undefined,
        });
      }

      throw AppError.internal({
        message: 'Failed to parse query in gpt',
        isOperational: false,
        stack: error instanceof Error ? error.stack : undefined,
      });
    }
  };
}

export default RecipeParse;
