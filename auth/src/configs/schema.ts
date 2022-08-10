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
  /**********************************
   JWT
   ***********************************/
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRE: Joi.string().required(),
  /**********************************
   Kafka
   ***********************************/
  KAFKA_BROKER: Joi.string().required(),
  KAFKA_CLIENT_USERNAME: Joi.string().required(),
  KAFKA_CLIENT_PASSWORD: Joi.string().required(),
  KAFKA_MAILCONSUMER_GROUPID: Joi.string().required(),
});

export default configsSchema;
