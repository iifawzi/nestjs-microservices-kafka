export default () => ({
  /**********************************
   Main Service Configurations 
  ***********************************/
  PORT: process.env.PORT || 3001,
  usersAuth: {
    secret: process.env.USERS_JWT_SECRET,
  },
  /**********************************
   Database
   ***********************************/
  MONGODB_URI: process.env.mongodbURI,
  DB_NAME: process.env.dbname,
  /**********************************
  SOCKET
  ***********************************/
  socket: {
    port: process.env.SOCKET_PORT
  },
  /**********************************
  redis
  ***********************************/
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  }
});
