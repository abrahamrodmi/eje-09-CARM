import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('SAES-IPN')
    .setDescription('API para el Sistema de Administración Escolar')
    .setVersion('1.0')
    .addTag('SAES-IPN')
    .addBearerAuth()
    .addServer('http://localhost:3000', 'servidor local')
    .addServer('https://saes-ipn-api.onrender.com', 'servidor de produccion')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  app.enableCors({ origin: ['https://saes-ipn-api.onrender.com', 'http://localhost:3000'], })
  app.useGlobalPipes(new ValidationPipe());
  {
    whitelist: true
  }
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
