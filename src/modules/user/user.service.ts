import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {

  @InjectRepository(User)
  private usersRepository: Repository<User>

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  // findOne(id: string): Promise<User> {
  //   return this.usersRepository.findOne(id);
  // }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async createUser(): Promise<string> {
    const data = new User()

    data.firstName = "zhang";
    data.lastName = "san";
    data.isActive = Math.random() < 0.5

    await this.usersRepository.save(data)

    return "create success"
  }
}
