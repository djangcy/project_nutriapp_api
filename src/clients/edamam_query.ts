import axios, { AxiosError, AxiosHeaders } from 'axios';
import AppError from '../utils/app_error';
import { EdamamRecipe } from '../models/edamam_types';

const EDAMAM_BASE_URL = 'https://api.edamam.com';

interface QueryOptions {
  route: string;
  method: string;
  headers?: Record<string, string>;
  params?: any;
}

class EdamamResult {
  private data: any;

  constructor(data: any) {
    this.data = data;
  }

  private extractRecipeData = (recipe: any): EdamamRecipe => {
    const {
      recipe: {
        uri,
        label,
        image,
        source,
        url,
        yield: servings,
        dietLabels,
        healthLabels,
        cautions,
        ingredientLines,
        ingredients,
        calories,
        totalWeight,
        totalTime,
        cuisineType,
        mealType,
        dishType,
        totalNutrients,
        instructionLines,
      },
    } = recipe;

    return {
      uri,
      label,
      image,
      source,
      recipeUrl: url,
      servings,
      dietLabels,
      healthLabels,
      cautions,
      ingredientLines,
      ingredients,
      calories,
      totalWeight,
      totalTime,
      cuisineType,
      mealType,
      dishType,
      totalNutrients,
      instructionLines,
    };
  };

  public toRecipe = (): EdamamRecipe => {
    return this.extractRecipeData(this.data);
  };

  public toRecipeCollection = (): {
    from: number;
    to: number;
    count: number;
    next: string | null;
    recipes: EdamamRecipe[];
  } => {
    const {
      from,
      to,
      count,
      _links: { next: { href } = {} as any },
      hits,
    } = this.data;

    const recipes: EdamamRecipe[] = hits.map((recipe: any) => {
      return this.extractRecipeData(recipe);
    });

    return { from, to, count, next: href ?? null, recipes: recipes };
  };
}

export class EdamamQueryClient {
  private route: string;
  private method?: string;
  private headers?: Record<string, string>;
  private params: any;

  constructor(queryOptions: QueryOptions) {
    this.route = queryOptions.route;
    this.method = queryOptions.method.toUpperCase();
    this.headers = queryOptions.headers ?? new AxiosHeaders();
    this.params = queryOptions.params;
  }

  private cleanUrl = (url: string): string => {
    let clean = url.replace(EDAMAM_BASE_URL, '');

    // Remove url if it still contains a full link.
    //  This means that the input url is one that
    //  doesn't point to Edamam.
    if (clean.match('http')) {
      clean = '';
    }

    return clean;
  };

  send = async (): Promise<EdamamResult> => {
    try {
      const url = `${EDAMAM_BASE_URL}${this.cleanUrl(this.route)}`;
      const result = await axios.request({
        url: url,
        method: this.method,
        headers: this.headers,
        params: this.params,
        paramsSerializer: {
          indexes: null, // fixes issue where a param is an array
        },
      });

      return new EdamamResult(result.data);
    } catch (error) {
      if (error instanceof AxiosError) {
        switch (error.response?.status) {
          case 400:
            throw AppError.internal({
              message: error.message,
              isOperational: true,
            });
          case 401:
            throw AppError.internal({
              message: 'Edamam API key is missing',
              isOperational: false,
            });
          case 403:
            throw AppError.internal({
              message: 'Edamam API key is missing',
              isOperational: false,
            });
          case 404:
            throw AppError.external();
          case 500:
            throw AppError.external();
        }
      }

      throw AppError.internal({
        message: 'Edamam API error',
        isOperational: false,
      });
    }
  };
}

export default EdamamQueryClient;
