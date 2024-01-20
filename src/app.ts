import express, { Express, Request, Response, NextFunction } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import helmet from 'helmet';
import dotenv from 'dotenv';
import cors from 'cors';

import RecipeSearch from './routes/recipe_search';
import AccessToken from './routes/access_token';

import ErrorHandler from './utils/error_handler';
import { validateApiKey } from './middleware/key_verification';
import { serveSwaggerUi, setupSwaggerUi } from './swagger/swagger';
import { timeout } from './middleware/timeout';

const app: Express = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet());
dotenv.config({ path: path.resolve(__dirname, '../config.env') });

// Set request timeout
app.use(timeout);

// Swagger
app.use('/docs', cors(), serveSwaggerUi);
app.get('/docs', setupSwaggerUi);

// routes
app.use('/api/tokens', AccessToken);
app.use('/api/recipe-search', validateApiKey, RecipeSearch);

// redirects
app.use('/', (req: Request, res: Response) => {
  res.redirect('/docs');
});

// Error handling
// Must go last
app.use(async function (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  await new ErrorHandler().handleError(err, res);

  next();
});

// Global 'uncaughtException' error handling
process.on('uncaughtException', async (error: Error) => {
  await new ErrorHandler().handleUncaughtError(error);
});

export default app;
