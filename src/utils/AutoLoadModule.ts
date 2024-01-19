import {DynamicModule} from "@nestjs/common";
import * as glob from 'glob';
import {Logger, Module} from "@nestjs/common";
import {ConnectionOptions} from 'typeorm';
import DatabaseConfig from "../config/database";
import {TypeOrmModule} from "@nestjs/typeorm"
import * as path from "path";

export const getModuleByPath = (path: string[]) => {
  if (Array.isArray(path) && path.length) {
    return path.map((i: string) => glob.sync(i))
      .flat()  // 或者使用 [].concat(...array) 来替代 flat()，具体取决于你的项目支持情况
      .map((path: string) => require(path))
      .map((i: any): any[] => Object.values(i) as any[])
      .flat()  // 或者使用 [].concat(...array)
  } else {
    return []
  }
}

export interface IAutoLoadModuleOption {
  name?: string;
  global?: boolean;
  path: string[];
}

@Module({})
export class AutoLoadControllerModule {

  static forRoot(options: IAutoLoadModuleOption): DynamicModule {
    const controllers: any[] = getModuleByPath(options.path);

    if (controllers.length > 0) {
      Logger.log(`${options.name ? `[${options.name}] ` : ''}Auto loaded: ${controllers.map((i: any) => i.name).join(', ')}`, this.name);
    } else {
      Logger.warn(`${options.name ? `[${options.name}] ` : ''}No controllers found`, this.name);
    }

    return {
      module: AutoLoadControllerModule,
      global: options.global,
      controllers: controllers
    };
  }
}

@Module({})
export class AutoLoadProviderModule {

  static forRoot(options: IAutoLoadModuleOption): DynamicModule {
    const providers: any[] = getModuleByPath(options.path);

    if (providers.length > 0) {
      Logger.log(`${options.name ? `[${options.name}] ` : ''}Auto loaded: ${providers.map((i: any) => i.name).join(', ')}`, this.name);
    } else {
      Logger.warn(`${options.name ? `[${options.name}] ` : ''}No providers found`, this.name);
    }


    // 创建动态模块
    return {
      module: AutoLoadProviderModule,
      global: options.global,
      providers: providers
    };
  }
}

@Module({})
export class AutoLoadModule {

  static forRoot(options: IAutoLoadModuleOption): DynamicModule {
    const module: any[] = getModuleByPath(options.path);

    if (module.length > 0) {
      Logger.log(`${options.name ? `[${options.name}] ` : ''}Auto loaded: ${module.map((i: any) => i.name).join(', ')}`, this.name);
    } else {
      Logger.warn(`${options.name ? `[${options.name}] ` : ''}No providers found`, this.name);
    }

    // 创建动态模块
    return {
      module: AutoLoadModule,
      global: options.global,
      imports: module
    };
  }
}

@Module({})
export class AutoLoadDatabaseModule {

  static async forRoot(options: IAutoLoadModuleOption): Promise<DynamicModule> {
    const entities: any[] = getModuleByPath(options.path)

    if (entities.length > 0) {
      Logger.log(`${options.name ? `[${options.name}] ` : ''}Auto loaded entities: ${entities.map((e: Function) => e.name).join(', ')}`, this.name);
    } else {
      Logger.warn(`${options.name ? `[${options.name}] ` : ''}No entities found`, this.name);
    }

    const connectionOptions: ConnectionOptions = {
      type: 'mariadb',
      host: DatabaseConfig.host,
      port: 3306,
      username: DatabaseConfig.username,
      password: DatabaseConfig.password,
      database: DatabaseConfig.database,
      entities: entities,
      synchronize: true,
    };

    return {
      module: AutoLoadDatabaseModule,
      global: options.global,
      imports: [TypeOrmModule.forRoot(connectionOptions)]
    };
  }
}
