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
    },
  },
  /**********************************
  Redis
  ***********************************/
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  },
  /**********************************
  Mailer
  ***********************************/
  mailer: {
    host: process.env.MAILER_HOST,
    port: process.env.MAILER_PORT,
    fromMail: process.env.MAILER_FROM,
    subject: process.env.MAILER_SUBJECT,
    auth: {
      user: process.env.MAILER_AUTH_USER,
      pass: process.env.MAILER_AUTH_PASS,
    }
  }
});
