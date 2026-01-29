import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { appConfig } from 'config/app.config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.enableShutdownHooks();
  app.enableCors(appConfig.cors);
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(appConfig.port);

  return app;
}

bootstrap()
  .then(() => {
    console.log('Server is running on port', appConfig.port);
  })
  .catch((error) => {
    console.error(error);
  });

process.on('unhandledRejection', (error) => {
  console.error(error);
});

// TODO: handle graceful shutdown
