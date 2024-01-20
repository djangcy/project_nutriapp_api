import { Request, Response, NextFunction } from 'express';

import RecipeSearch from '../repositories/recipe_search';
import AppError from '../utils/app_error';
import { RecipeSearchSchema } from '../schemas/recipe_search.schema';
import RecipeParseService from '../services/recipe_parse';
import { zodErrorToString } from '../helpers/zod_error_to_string';

class RecipeSearchController {
  static getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const options = RecipeSearchSchema.safeParse(req.query);

      if (!options.success) {
        throw AppError.badRequest(zodErrorToString(options.error));
      }

      const result = await RecipeSearch.getAll(options.data);

      res.status(200).send(result);
    } catch (error) {
      if (error instanceof AppError) {
        next(error);
      } else {
        next(AppError.badRequest());
      }
    }
  };

  static getByUri = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { uri } = req.query; // query params
      const options = {
        type: ((req.query.type as string) || undefined) ?? 'public',
      }; // query params

      // Check if Uri, and filter out non-string values
      const uriArray: string[] = Array.isArray(uri)
        ? (uri.filter(
            (item): item is string => typeof item === 'string'
          ) as string[])
        : ([uri].filter(Boolean) as string[]);

      const result = await RecipeSearch.getByUri(uriArray, options);

      res.status(200).send(result);
    } catch (error) {
      if (error instanceof AppError) {
        next(error);
      } else {
        next(AppError.badRequest());
      }
    }
  };

  static getById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params; // path params
      const options = {
        type: ((req.query.type as string) || undefined) ?? 'public',
      }; // query params

      const result = await RecipeSearch.getById(id, options);

      res.status(200).send(result);
    } catch (error: any) {
      throw AppError.badRequest(error?.message ?? 'Unknown Error');
    }
  };

  static query = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { text } = req.body;

      // Check if 'text' is missing or empty
      if (!text || typeof text !== 'string') {
        throw AppError.badRequest('Missing or invalid "text" parameter');
      }

      const result = await RecipeParseService.parseRecipeFromText(text);

      res.status(200).send({
        query: result.prompt,
        ...result.value,
      });
    } catch (error) {
      if (error instanceof AppError) {
        next(error);
      } else if (error instanceof Error) {
        next(AppError.fromError(error));
      }
    }
  };
}

export default RecipeSearchController;
