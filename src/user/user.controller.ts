import { Body, Controller, Delete, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import {
  CreateUserDto,
  DeleteUserDto,
  ResponseUserDto,
  UpdatePasswordDto,
  UpdateUserDto,
} from './user.dto';
import { Prisma, User } from 'src/generated/prisma/client';
import { PrismaClientKnownRequestError } from 'src/generated/prisma/internal/prismaNamespace';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/create')
  createUser(@Body() user: CreateUserDto): Promise<ResponseUserDto> {
    return this.userService.createUser(user);
  }
  @UseGuards(JwtAuthGuard)
  @Patch('/:email/username')
  updateUsername(
    @Param('email') email: string,
    @Body() dto: UpdateUserDto,
  ): Promise<Partial<User>> {
    return this.userService.updateUserName(email, dto.username);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/delete')
  deleteUser(@Body() user: DeleteUserDto): Promise<User> {
    return this.userService.deleteUser(user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:email/password')
  updatePassword(
    @Param('email') email: string,
    @Body() dto: { password: string; newPassword: string },
  ): Promise<boolean> {
    return this.userService.updateUserPassword(email, dto);
  }
}
