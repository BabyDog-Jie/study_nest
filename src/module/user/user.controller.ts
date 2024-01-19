import {Controller, Get, Post} from '@nestjs/common';
import {UserService} from "./user.service";

@Controller("user")
export class UserController {

  private userService: UserService

  @Get()
  getHello(): string {
    return "this is user controller";
  }

  @Post()
  async create() {
    // await this.userService.create()
    return "success create"
  }
}
