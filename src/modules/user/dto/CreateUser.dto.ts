import {IsString, IsBoolean, IsNotEmpty} from 'class-validator';

export class CreateUserDto {

  @IsString()
  @IsNotEmpty({
    message: "请传递用户的姓氏"
  })
  firstName: string;

  @IsString()
  lastName: string;

  @IsBoolean()
  isActive: boolean;
}
