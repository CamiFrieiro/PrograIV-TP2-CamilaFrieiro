import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

let app: any;


//modificacion para deployar
async function bootstrap() {
  if (!app) {
    app = await NestFactory.create(AppModule);
    app.enableCors();
    await app.init();
  }
  return app;
}

export default async (req: any, res: any) => {
  const server = await bootstrap();
  server.getHttpAdapter().getInstance()(req, res);
};