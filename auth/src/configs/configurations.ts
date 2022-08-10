export default () => ({
  /**********************************
   Main Service Configurations 
  ***********************************/
  PORT: process.env.PORT || 5002,
  API_GLOBAL_PREFIX: process.env.API_GLOBAL_PREFIX,
  SWAGGER_DOCS_PATH: process.env.SWAGGER_DOCS_PATH,
  SWAGGER_USERNAME: process.env.swaggerUsername,
  SWAGGER_PASSWORD: process.env.swaggerPassword,
  /**********************************
   Database
   ***********************************/
  MONGODB_URI: process.env.mongodbURI,
  DB_NAME: process.env.dbname,
  /**********************************
   JWT
   ***********************************/
  jwt: {
    secret: process.env.JWT_SECRET,
    expire: process.env.JWT_EXPIRE,
  },
  /**********************************
  Kafka
  ***********************************/
  kafka: {
    broker: process.env.KAFKA_BROKER,
    client: {
      username: process.env.KAFKA_CLIENT_USERNAME,
      password: process.env.KAFKA_CLIENT_PASSWORD,
    },
    mailConsumer: {
      groupId: process.env.KAFKA_MAILCONSUMER_GROUPID
    },
    authConsumer: {
      groupId: process.env.KAFKA_AUTHCONSUMER_GROUPID
    }
  }
});
