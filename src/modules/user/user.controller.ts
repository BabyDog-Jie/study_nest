import {
  BadGatewayException,
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpException,
  Logger,
  Post,
  ValidationPipe
} from '@nestjs/common';
import {UserService} from "./user.service";
import {CreateUserDto} from "./dto/CreateUser.dto";

@Controller("user")
export class UserController {

  constructor(private readonly userService: UserService) {}

  @Get()
  getHello(): string {
    return "this is user controller";
  }

  @Post("/create")
  async create(@Body() user: CreateUserDto) {
    Logger.log(user)
    // const result = await this.userService.createUser()
    return "success create"
  }

  @Get("/find")
  async findAll() {
    return await this.userService.findAll()
  }

  @Get("/data")
  async testData() {
    return "test data"
  }

  @Get("/error")
  async testError() {
    // throw new BadGatewayException("BadGatewayException Error")
    // throw new HttpException("请求失败", 500)
    throw new Error("请求失败")
  }
}
