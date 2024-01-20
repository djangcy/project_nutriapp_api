import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/app_error';

const methods =
  (methods: string[]) => (req: Request, res: Response, next: NextFunction) => {
    if (methods.includes(req.method)) {
      return next();
    }

    res.status(405).header('Accept', methods.join(', '));
    next(
      new AppError({
        name: 'Method Not Allowed',
        isOperational: true,
        statusCode: 405,
        message: `Cannot ${req.method} ${req.url}`,
      })
    );
  };

export default methods;
