import { Request, Response, NextFunction } from 'express';
import * as TokenService from '../services/token_service';
import AppError from '../utils/app_error';

//* https://security.stackexchange.com/a/266207

function extractToken(req: Request): string | null {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(' ')[0] === 'Bearer'
  ) {
    return req.headers.authorization.split(' ')[1];
  }

  return null;
}

export const validateApiKey = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = extractToken(req);

    // Error is thrown if unsuccessful
    TokenService.verifyToken(token);

    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(AppError.internal({ isOperational: true }));
    }
  }
};
