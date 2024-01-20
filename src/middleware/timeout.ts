import { Request, Response, NextFunction } from 'express';

export const timeout = function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Set timeout after x seconds (milliseconds)
  res.setTimeout(6000, () => {
    res.status(408).send('Request Timeout');
  });

  next();
};
