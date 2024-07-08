import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { NestExpressApplication } from '@nestjs/platform-express';
import { WebsocketAdapter } from './websocket/websocket.adapter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
  });
  app.useWebSocketAdapter(new WebsocketAdapter(app));

  app.setGlobalPrefix('api', { exclude: ['docs'] });

  const configService = app.get(ConfigService);
  app.use(helmet());
  app.enableCors({
    origin: configService.get('WEB_APP_URL'),
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const configDocApi = new DocumentBuilder()
    .setTitle('Hust Course API')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, configDocApi);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'method',
    },
  });

  await app.listen(configService.get<number>('PORT')!);
}

bootstrap();
