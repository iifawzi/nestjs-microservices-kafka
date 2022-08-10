export default () => ({
  /**********************************
  Kafka
  ***********************************/
  kafka: {
    client: {
      username: process.env.KAFKA_CLIENT_USERNAME,
      password: process.env.KAFKA_CLIENT_PASSWORD,
    },
    mailConsumer: {
      groupId: process.env.KAFKA_MAILCONSUMER_GROUPID
    }
  }
});