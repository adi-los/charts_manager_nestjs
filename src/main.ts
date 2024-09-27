import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();

// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);

//   // Create Swagger documentation
//   const options = new DocumentBuilder()
//     .setTitle('Charts Manager By Adil')
//     .setDescription('Manage Your Cluster With a Smart Way')
//     .setVersion('1.0')
//     .addTag('deploy') // Optional: Add tags for better organization
//     .build();

//   const document = SwaggerModule.createDocument(app, options);
//   SwaggerModule.setup('api/docs', app, document); // Setup endpoint for Swagger UI

//   await app.listen(3000);
// }

// bootstrap();
