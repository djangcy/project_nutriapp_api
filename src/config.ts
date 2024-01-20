import dotenv from 'dotenv';
import path from 'path';

const configPath = path.resolve(__dirname, '../config.env');
dotenv.config({ path: configPath });

const Config = {
  node_env: process.env.NODE_ENV,

  edamamNutritionAppId: process.env.EDAMAM_NUTRITION_APP_ID,
  edamamNutritionAppKey: process.env.EDAMAM_NUTRITION_APP_KEY,
  edamamRecipeAppId: process.env.EDAMAM_RECIPE_APP_ID,
  edamamRecipeAppKey: process.env.EDAMAM_RECIPE_APP_KEY,
  edamamDatabaseAppId: process.env.EDAMAM_DATABASE_APP_ID,
  edamamDatabaseAppKey: process.env.EDAMAM_DATABASE_APP_KEY,

  mongoConnectionString: process.env.MONGO_CONNECTION_STRING,

  cohereApiKey: process.env.COHERE_API_KEY,
  openApiKey: process.env.OPEN_API_KEY,

  jwtSecret: process.env.JWT_SECRET,
};

export default Config;
