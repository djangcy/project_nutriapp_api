import axios from 'axios';
import Config from '../config';
import AppError from '../utils/app_error';

const COHERE_BASE_URL = 'https://api.cohere.ai';
const COHERE_MODEL_ID = '511b2a47-6050-4bd8-a9db-552c8cbff2e4-ft';

interface RecipeParseResult {
  prompt: string;
  value: string;
}

class RecipeParse {
  public parseRecipeFromText = async (
    text: string
  ): Promise<RecipeParseResult> => {
    try {
      const body = {
        model: COHERE_MODEL_ID,
        prompt: text,
      };

      const result = await axios.post(`${COHERE_BASE_URL}/v1/generate`, body, {
        headers: {
          Authorization: `BEARER ${Config.cohereApiKey}`,
          'Content-Type': 'application/json',
        },
      });

      let value = result.data.generations[0].text;
      value = value.replaceAll(/'/g, `"`);

      return {
        value: value,
        prompt: result.data.prompt,
      };
    } catch (error) {
      throw AppError.internal({
        message: 'Failed to parse query in cohere',
        isOperational: false,
        stack: error instanceof Error ? error.stack : undefined,
      });
    }
  };
}

export default RecipeParse;
