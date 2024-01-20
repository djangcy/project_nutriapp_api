import swaggerUi from 'swagger-ui-express';

import swaggerConfig from './swagger-config.json';
import swaggerJSDoc from 'swagger-jsdoc';

export const serveSwaggerUi = swaggerUi.serve;

const options: swaggerJSDoc.Options = {
  swaggerDefinition: swaggerConfig,
  apis: ['src/routes/*.ts', 'src/schemas/*.ts', 'src/**/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);
export const setupSwaggerUi = swaggerUi.setup(swaggerSpec);
