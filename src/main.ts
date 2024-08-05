import helmet from 'helmet';
import { mw } from 'request-ip';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
// import { HttpExceptionFilter } from 'src/common/filters/http-exception.filter';
// import { PrismaClientExceptionFilter } from 'nestjs-prisma';
import { NestExpressApplication } from '@nestjs/platform-express';
// import { FormatResponse } from './common/interceptor/response.interceptor';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    // 日志
    logger: WinstonModule.createLogger({
      transports: [
        new winston.transports.DailyRotateFile({
          level: 'info',
          dirname: 'logs',
          filename: '%DATE%.log',
          datePattern: 'YYYY-MM-DD-HH-mm',
        }),
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            nestWinstonModuleUtilities.format.nestLike(),
          ),
        }),
      ],
    }),
  });
  // 获取环境变量
  const config = app.get(ConfigService);
  const PREFIX = config.get<string>('PREFIX');
  const NAME = config.get<string>('APP_NAME');
  const PORT = config.get<number>('PORT');

  // 设置 api 访问前缀
  app.setGlobalPrefix(PREFIX);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  // 全局异常过滤器
  // app.useGlobalFilters(new HttpExceptionFilter());
  // 时区转换
  // app.useGlobalInterceptors(new FormatResponse());

  // web 安全，防常见漏洞
  app.use(helmet());

  const swaggerOptions = new DocumentBuilder()
    .setTitle(`${NAME} 接口文档`)
    .setDescription(`The ${NAME} API escription`)
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'bearer',
      description: '基于 JWT token',
    })
    .build();
  const document = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup(`doc`, app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: `${NAME} API Docs`,
  });

  // 获取真实 ip
  app.use(mw({ attributeName: 'ip' }));
  //服务端口
  await app.listen(PORT);
  console.log(
    `服务启动成功 `,
    '\n',
    '服务地址',
    `http://localhost:${PORT}/${PREFIX}/`,
    '\n',
    '文档地址',
    `http://localhost:${PORT}/doc/`,
  );
}
bootstrap();
