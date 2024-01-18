import { Controller, Get } from '@nestjs/common';

@Controller("child")
export class ChildController {

  @Get()
  getHello(): string {
    return "this is child controller";
  }
}
