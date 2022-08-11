import * as Joi from 'joi';

const configsSchema = Joi.object({
  /**********************************
   Main Service Configurations 
  ***********************************/
  PORT: Joi.number(),
  USERS_JWT_SECRET: Joi.string().required(),
  /**********************************
   Database
   ***********************************/
  mongodbURI: Joi.string().required(),
  dbname: Joi.string().required(),
  /**********************************
   Socket
   ***********************************/
  SOCKET_PORT: Joi.string().required(),
  /**********************************
   Redis
   ***********************************/
   REDIS_HOST: Joi.string().required(),
   REDIS_PORT: Joi.string().required()
});

export default configsSchema;
