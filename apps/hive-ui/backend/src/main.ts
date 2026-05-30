import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: 'http://localhost:5174' });
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Hive UI API')
    .setDescription('API do backend da Hive UI — estado do squad, telemetria, locks, dispatch e governança.')
    .setVersion('1.0')
    .addTag('hive')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = Number(process.env.PORT || '3001');
  await app.listen(port);
}

void bootstrap();
