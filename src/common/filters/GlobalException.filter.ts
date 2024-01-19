import {
  Catch,
  ArgumentsHost,
  Logger,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  BadRequestException
} from '@nestjs/common';
import {Request, Response} from "express";
import {ResponseModel} from "../model/ResponseModel";
import {ValidationError} from "class-validator";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
    }

    Logger.error(`Bad Request path: ${request.url}`)
    Logger.error(`Bad Request info: ${exception.stack}`)

    response
      .status(status)
      .json(new ResponseModel(status, message, null));
  }
}
