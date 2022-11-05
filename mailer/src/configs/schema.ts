import * as Joi from 'joi';
const configsSchema = Joi.object({
  /**********************************
   Main Service Configurations 
   ***********************************/
   VERIFY_URL: Joi.string().required(),
   PORT: Joi.string().required(),
  /**********************************
   Kafka
   ***********************************/
  KAFKA_CLIENT_USERNAME: Joi.string().required(),
  KAFKA_CLIENT_PASSWORD: Joi.string().required(),
  KAFKA_BROKER: Joi.string().required(),
  KAFKA_MAILCONSUMER_GROUPID: Joi.string().required(),
  /**********************************
   REDIS
   ***********************************/
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.string().required(),
  /**********************************
   Mailer
   ***********************************/
  MAILER_HOST: Joi.string().required(),
  MAILER_PORT: Joi.string().required(),
  MAILER_FROM: Joi.string().required(),
  MAILER_SUBJECT: Joi.string().required(),
  MAILER_AUTH_USER: Joi.string().required(),
  MAILER_AUTH_PASS: Joi.string().required(),
});

export default configsSchema;
