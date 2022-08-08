import * as Joi from 'joi';

const configsSchema = Joi.object({
  /**********************************
   Main Service Configurations 
  ***********************************/
  PORT: Joi.number(),
  API_GLOBAL_PREFIX: Joi.string().required(),
  SWAGGER_DOCS_PATH: Joi.string().required(),
  swaggerUsername: Joi.string().required(),
  swaggerPassword: Joi.string().required(),
  /**********************************
   Database
   ***********************************/
  mongodbURI: Joi.string().required(),
  dbname: Joi.string().required(),

});

export default configsSchema;