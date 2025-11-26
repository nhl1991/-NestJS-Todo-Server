import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }));
  app.use(cookieParser());
  app.use(session({
      secret: 'very-important-secret',
      resave: false, // 세션을 항상 저장할지 여부
      saveUninitialized: false,
      cookie: { maxAge: 3600000 }, // 쿠키 유효시간 1시간
  }))
  app.use(passport.initialize());
  app.use(passport.session());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
