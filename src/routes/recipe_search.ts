import express, { Router } from 'express';
import controller from '../controllers/recipe_search';
import methods from '../middleware/allowed_methods';

const router: Router = express.Router();

/**
 * @openapi
 * /api/recipe-search/:
 *  get:
 *    tags:
 *      - Recipe Search
 *    summary: Returns a list of recipes based on the query.
 *    parameters:
 *       - $ref: '#/components/parameters/RecipeSearchParamsType'
 *       - $ref: '#/components/parameters/RecipeSearchParamsQ'
 *       - $ref: '#/components/parameters/RecipeSearchParamsFrom'
 *       - $ref: '#/components/parameters/RecipeSearchParamsTo'
 *       - $ref: '#/components/parameters/RecipeSearchParamsIngr'
 *       - $ref: '#/components/parameters/RecipeSearchParamsDiet'
 *       - $ref: '#/components/parameters/RecipeSearchParamsHealth'
 *       - $ref: '#/components/parameters/RecipeSearchParamsCuisineType'
 *       - $ref: '#/components/parameters/RecipeSearchParamsMealType'
 *       - $ref: '#/components/parameters/RecipeSearchParamsDishType'
 *       - $ref: '#/components/parameters/RecipeSearchParamsCalories'
 *       - $ref: '#/components/parameters/RecipeSearchParamsTime'
 *       - $ref: '#/components/parameters/RecipeSearchParamsExcluded'
 *    responses:
 *      200:
 *        description: Returns a list of recipes
 */
router
  .route('/')
  .all(methods(['GET']))
  .get(controller.getAll);

/**
 * @openapi
 * /api/recipe-search/by-uri:
 *  get:
 *    tags:
 *      - Recipe Search
 *    summary: Returns a single recipe by URI.
 *    parameters:
 *      - $ref: '#/components/parameters/RecipeSearchParamsType'
 *      - name: uri
 *        in: query
 *        schema:
 *          type: string
 *        required: true
 *    responses:
 *      200:
 *        description: Returns a single recipe
 */
router
  .route('/by-uri')
  .all(methods(['GET']))
  .get(controller.getByUri);

/**
 * @openapi
 * /api/recipe-search/query:
 *  post:
 *    tags:
 *      - Recipe Search
 *    summary: Returns a single recipe from a natural language query.
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              text:
 *                type: string
 *                description: Natural language query
 *    responses:
 *      200:
 *        description: Returns a list of recipes
 */
router
  .route('/query')
  .all(methods(['POST']))
  .post(controller.query);

/**
 * @openapi
 * /api/recipe-search/recipes/{id}:
 *  get:
 *    tags:
 *      - Recipe Search
 *    summary: Returns a single recipe by ID.
 *    parameters:
 *      - $ref: '#/components/parameters/RecipeSearchParamsType'
 *      - name: id
 *        in: path
 *        schema:
 *          type: string
 *        required: true
 *    responses:
 *      200:
 *        description: Returns a single recipe
 */
router
  .route('/recipes/:id')
  .all(methods(['GET']))
  .get(controller.getById);

export default router;
