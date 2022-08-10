export default () => ({
  /**********************************
   Main Service Configurations 
  ***********************************/
  PORT: process.env.PORT || 3001,
  usersAuth: {
    secret: process.env.USERS_JWT_SECRET,
  },
  /**********************************
  SOCKET
  ***********************************/
  socket: {
    port: process.env.SOCKET_PORT
  },
});
