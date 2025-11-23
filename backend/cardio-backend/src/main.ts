import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(
    new ValidationPipe({ 
      whitelist: true, 
      transform: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) => {
        const messages = errors.map((error) => ({
          field: error.property,
          errors: Object.values(error.constraints || {}),
        }));
        console.error('Validation errors:', messages);
        return new BadRequestException({
          message: 'Validação falhou',
          errors: messages,
        });
      },
    })
  );
  
  app.enableCors({ origin: true });
  await app.listen(process.env.PORT ?? 3000);
  console.log(`Servidor rodando em porta ${process.env.PORT ?? 3000}`);
}

bootstrap();

