import { Request, Response, NextFunction } from 'express';

import * as TokenUtils from '../services/token_service';
import AppError from '../utils/app_error';

class AccessTokenController {
  static getAccessToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const adminKey: string = 'admin_token';

      const requestKey = req.query.key;

      if (!requestKey) {
        throw AppError.badRequest();
      }

      if (adminKey !== requestKey) {
        throw AppError.forbidden();
      }

      const newKey = TokenUtils.generateApiKey();

      res.status(200).json({
        token: newKey,
      });
    } catch (error) {
      if (error instanceof AppError) {
        next(error);
      } else if (error instanceof Error) {
        next(AppError.fromError(error));
      }
    }
  };

  static refreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const requestToken = req.body.refreshToken;

      if (!requestToken) {
        next(AppError.badRequest());
      }

      const result = TokenUtils.refreshToken(requestToken);

      if (!result) {
        throw AppError.badRequest('Invalid Token');
      }

      res.status(200).json({
        token: result,
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

export default AccessTokenController;
