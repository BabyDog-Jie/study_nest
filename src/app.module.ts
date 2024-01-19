import { Module } from '@nestjs/common';
import {
  AutoLoadModule,
  AutoLoadDatabaseModule,
  AutoLoadInterceptorModule,
  AutoLoadFilterModule
} from "./utils/AutoLoadModule";
import * as path from "path";

// 自动加载目标目录下的模块文件（modules, database）
@Module({
  imports: [
    AutoLoadDatabaseModule.forRoot({
      path: [path.join(__dirname, "./modules/**/*.entity{.ts,.js}")],
      global: true
    }),
    AutoLoadModule.forRoot({
      path: [path.join(__dirname, "./modules/**/*.module{.ts,.js}")],
      global: true
    }),
    AutoLoadInterceptorModule.forRoot({
      path: [path.join(__dirname, "./common/interceptors/**/*.interceptor{.ts,.js}")]
    }),
    AutoLoadFilterModule.forRoot({
      path: [path.join(__dirname, "./common/filters/**/*.filter{.ts,.js}")]
    }),
  ]
})

export class AppModule {}
