import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import {AutoControllerModule, AutoDatabaseModule, AutoProviderModule} from "./utils/AutoLoadModule";
import {AppController} from "./app.controller";
import * as path from "path";

// 自动加载目标目录下的模块文件（controller, service, database）
@Module({
  imports: [
    AutoDatabaseModule.forRoot({
      path: [path.join(__dirname, "./entity/**/*.js")]
    }),
    AutoControllerModule.forRoot({
      path: [path.join(__dirname, "./controller/**/*.js")]
    }),
    AutoProviderModule.forRoot({
      path: [path.join(__dirname, "./service/**/*.js")]
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
