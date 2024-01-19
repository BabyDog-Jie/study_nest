import {Controller, Get, Post} from '@nestjs/common';
import {UserService} from "./user.service";

@Controller("user")
export class UserController {

  constructor(private readonly userService: UserService) {}

  @Get()
  getHello(): string {
    return "this is user controller";
  }

  @Post()
  async create() {
    const result = await this.userService.createUser()
    return "success create"
  }

  @Get("/find")
  async findAll() {
    return await this.userService.findAll()
  }
}
