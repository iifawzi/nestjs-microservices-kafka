import * as Joi from 'joi';

const configsSchema = Joi.object({
  /**********************************
   Main Service Configurations 
  ***********************************/
   PORT: Joi.number(),
  /**********************************
   Kafka
   ***********************************/
  KAFKA_BROKER: Joi.string().required(),
  KAFKA_CLIENT_USERNAME: Joi.string().required(),
  KAFKA_CLIENT_PASSWORD: Joi.string().required(),
  KAFKA_AUTHCONSUMER_GROUPID: Joi.string().required(),
  /**********************************
   Socket
   ***********************************/
   SOCKET_PORT: Joi.string().required(),

});

export default configsSchema;
