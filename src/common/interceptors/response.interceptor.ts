import {Injectable, NestInterceptor, ExecutionContext, CallHandler} from '@nestjs/common';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => {
        return {
          code: 200,
          data,
          message: "请求成功"
        };
      }),
    );
  }
}

// import { APP_INTERCEPTOR } from '@nestjs/core';
// @Module({
//   controllers: [UserController],
//   providers: [
//     UserService,
//     {
//       provide: APP_INTERCEPTOR,
//       useClass: ResponseInterceptor,
//     },
//   ],
// })
// export class AppModule {}
