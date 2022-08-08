export default () => ({
  /**********************************
   Main Service Configurations 
  ***********************************/
  PORT: parseInt(process.env.PORT) || 3000,
  API_GLOBAL_PREFIX: process.env.API_GLOBAL_PREFIX,
  SWAGGER_DOCS_PATH: process.env.SWAGGER_DOCS_PATH,
  SWAGGER_USERNAME: process.env.swaggerUsername,
  SWAGGER_PASSWORD: process.env.swaggerPassword,
  /**********************************
   Database
   ***********************************/
  MONGODB_URI: process.env.mongodbURI,
  DB_NAME: process.env.dbname
});
