import {Injectable, NestInterceptor, ExecutionContext, BadGatewayException, CallHandler} from '@nestjs/common';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

@Injectable()
export class ExceptionInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError(error => {
        // 在这里进行自定义的异常处理逻辑
        if (error instanceof BadGatewayException) {
          return throwError({
            code: 500,
            message: 'Bad Gateway Exception',
          });
        } else {
          return throwError({
            code: 500,
            message: 'Internal Server Error',
          });
        }
      }),
    );
  }
}
