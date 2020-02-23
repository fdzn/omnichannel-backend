import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
// import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./entity/user.entity";
import { UsersService } from "./user.service";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  
  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Delete(":id")
  remove(@Param("id") id: string): Promise<void> {
    return this.usersService.remove(id);
  }
}
