export default () => ({
  /**********************************
   Main Service Configurations 
  ***********************************/
   PORT: process.env.PORT || 3001,
  /**********************************
  Kafka
  ***********************************/
  kafka: {
    client: {
      broker: process.env.KAFKA_BROKER,
      username: process.env.KAFKA_CLIENT_USERNAME,
      password: process.env.KAFKA_CLIENT_PASSWORD,
    },
    authConsumer: {
      groupId: process.env.KAFKA_AUTHCONSUMER_GROUPID
    }
  }
});
