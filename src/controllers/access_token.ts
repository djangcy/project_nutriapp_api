import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

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

      if (!requestKey || !(typeof requestKey == 'string')) {
        throw AppError.badRequest();
      }

      const encoder = new TextEncoder();

      if (
        !crypto.timingSafeEqual(
          encoder.encode(adminKey),
          encoder.encode(requestKey)
        )
      ) {
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
}

export default AccessTokenController;
