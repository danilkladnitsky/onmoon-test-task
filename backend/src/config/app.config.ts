export const appConfig = {
  port: Number(process.env.PORT) || 3000,
  cors:
    process.env.PROD === 'true'
      ? {
          origin: process.env.FRONTEND_URL,
          methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
          allowedHeaders: ['Authorization', 'Content-Type'],
        }
      : {
          origin: '*',
          methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
          allowedHeaders: ['Authorization', 'Content-Type'],
        },
};
