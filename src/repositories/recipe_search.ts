import Config from '../config';
import EdamamQueryClient from '../clients/edamam_query';
import { removeUndefinedValues } from '../utils/remove_undefined_values';

const edamamRecipeTokens = {
  app_id: Config.edamamRecipeAppId,
  app_key: Config.edamamRecipeAppKey,
};

class RecipeSearch {
  static getAll = async (options: any): Promise<any> => {
    const edamamQuery = new EdamamQueryClient({
      route: '/api/recipes/v2',
      method: 'GET',
      params: { ...removeUndefinedValues(options), ...edamamRecipeTokens },
    });

    return (await edamamQuery.send()).toRecipeCollection();
  };

  static getById = async (
    id: string,
    options: {
      type: string;
    }
  ): Promise<any> => {
    const edamamQuery = new EdamamQueryClient({
      route: `/api/recipes/v2/${id}`,
      method: 'GET',
      params: { ...removeUndefinedValues(options), ...edamamRecipeTokens },
    });

    const result = (await edamamQuery.send()).toRecipe();

    return result;
  };

  static getByUri = async (
    uri: Array<string>,
    options: {
      type: string;
    }
  ): Promise<any> => {
    const edamamQuery = new EdamamQueryClient({
      route: '/api/recipes/v2/by-uri',
      method: 'GET',
      params: {
        uri: uri,
        ...removeUndefinedValues(options),
        ...edamamRecipeTokens,
      },
    });

    const result = (await edamamQuery.send()).toRecipeCollection();

    return result;
  };
}

export default RecipeSearch;
