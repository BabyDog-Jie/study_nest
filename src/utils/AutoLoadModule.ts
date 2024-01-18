import {DynamicModule} from "@nestjs/common";
import * as glob from 'glob';
import {Logger, Module} from "@nestjs/common";
import {ConnectionOptions, createConnection} from 'typeorm';
import DatabaseConfig from "../config/database";

export type TModuleType = "__controller__" | "__injectable__" | "__entity__"

export const getModuleByPath = (path: string[], moduleType: TModuleType) => {
  if (Array.isArray(path) && path.length) {
    return path.map((i: string) => glob.sync(i))
      .flat()  // 或者使用 [].concat(...array) 来替代 flat()，具体取决于你的项目支持情况
      .map((path: string) => require(path))
      .map((i: any): any[] => Object.values(i) as any[])
      .flat()  // 或者使用 [].concat(...array)
      .filter((i: any) => typeof i === 'function' && Reflect.getOwnMetadataKeys(i).includes(moduleType));
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
export class AutoControllerModule {

  static forRoot(options: IAutoLoadModuleOption): DynamicModule {
    const controllers: any[] = getModuleByPath(options.path, '__controller__');

    if (controllers.length > 0) {
      Logger.log(`${options.name ? `[${options.name}] ` : ''}Auto loaded: ${controllers.map((i: any) => i.name).join(', ')}`, this.name);
    } else {
      Logger.warn(`${options.name ? `[${options.name}] ` : ''}No controllers found`, this.name);
    }

    return {
      module: AutoControllerModule,
      global: options.global,
      providers: [...controllers],
      controllers: [...controllers],
      exports: [...controllers],
    };
  }
}

@Module({})
export class AutoProviderModule {

  static forRoot(options: IAutoLoadModuleOption): DynamicModule {
    const providers: any[] = getModuleByPath(options.path, '__injectable__');

    if (providers.length > 0) {
      Logger.log(`${options.name ? `[${options.name}] ` : ''}Auto loaded: ${providers.map((i: any) => i.name).join(', ')}`, this.name);
    } else {
      Logger.warn(`${options.name ? `[${options.name}] ` : ''}No providers found`, this.name);
    }


    // 创建动态模块
    return {
      module: AutoProviderModule,
      global: options.global,
      providers: [...providers],
      exports: [...providers],
    };
  }
}

@Module({})
export class AutoDatabaseModule {

  static async forRoot(options: IAutoLoadModuleOption): Promise<DynamicModule> {
    const connections: any[] = getModuleByPath(options.path, "__entity__")

    const entities: Function[] = connections.map((connection: any) => connection.options.entities).flat();

    if (entities.length > 0) {
      Logger.log(`${options.name ? `[${options.name}] ` : ''}Auto loaded entities: ${entities.map((e: Function) => e.name).join(', ')}`, this.name);
    } else {
      Logger.warn(`${options.name ? `[${options.name}] ` : ''}No entities found`, this.name);
    }

    const connectionOptions: ConnectionOptions = {
      // Define your connection options here
      type: 'mariadb',
      host: DatabaseConfig.host,
      port: 3306,
      username: DatabaseConfig.username,
      password: DatabaseConfig.password,
      database: DatabaseConfig.database,
      entities: entities,
      synchronize: true,
    };

    const connection = await createConnection(connectionOptions);

    return {
      module: AutoDatabaseModule,
      global: options.global,
      providers: [
        {
          provide: 'DATABASE_CONNECTION',
          useValue: connection,
        },
      ],
      exports: ['DATABASE_CONNECTION'],
    };
  }
}
