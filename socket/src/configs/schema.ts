import * as Joi from 'joi';

const configsSchema = Joi.object({
  /**********************************
   Kafka
   ***********************************/
  KAFKA_CLIENT_USERNAME: Joi.string().required(),
  KAFKA_CLIENT_PASSWORD: Joi.string().required(),
  KAFKA_MAILCONSUMER_GROUPID: Joi.string().required(),
});

export default configsSchema;
