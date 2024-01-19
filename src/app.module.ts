import { Module } from '@nestjs/common';
import {AutoLoadModule, AutoLoadDatabaseModule} from "./utils/AutoLoadModule";
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
    })
  ]
})

export class AppModule {}
