import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, User } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma.service';
import { DeleteUserDto, ResponseUserDto, UpdateUserDto } from './user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: Prisma.UserCreateInput): Promise<ResponseUserDto> {
    try {
      const hashedPassword = bcrypt.hashSync(data.password, 10);
      data.password = hashedPassword;
      const user = await this.prisma.user.create({
        data,
      });

      const { password, id, uuid, ...rest } = user;

      return rest;
    } catch (err) {
      if (err.code === 'P2002')
        throw new ConflictException('이미 존재하는 이메일입니다.');
      throw err;
    }
  }

  async deleteUser(data: DeleteUserDto): Promise<User> {
    try {
      return await this.prisma.user.delete({
        where: {
          email: data.email,
        },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2025') {
          throw new NotFoundException('유저를 찾을 수 없습니다.');
        }
      }
      throw err; // unknown error → 500
    }
  }

  async updateUserName(
    email: string,
    username: string,
  ): Promise<Partial<User>> {
    try {
      return await this.prisma.user.update({
        omit: {
          password: true,
        },
        where: {
          email: email,
        },
        data: {
          username: username,
        },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2025')
          throw new NotFoundException('유저를 찾을 수 없습니다.');
      }
      throw err;
    }
  }

  async updateUserPassword(
    email: string,
    dto: { password: string; newPassword: string },
  ) {
    try {
      const user = await this.prisma.user
        .findUniqueOrThrow({
          select: {
            password: true,
          },
          where: {
            email: email,
          },
        })
        .then((res) => {
          return bcrypt.compareSync(dto.password, res.password);
        });
      if (user) {
        const hashedPassword = bcrypt.hashSync(dto.newPassword, 10);
        await this.prisma.user.update({
          where: {
            email: email,
          },
          data: {
            password: hashedPassword,
          },
        });
        console.log('패스워드 변경 완료.')
        return true;
      }

      return false;
    } catch (err) {
      throw err;
    }
  }

  async getUser(email: string){
    const user = await this.prisma.user.findUnique({
      where: {
        email: email
      }
    })
    const password ='password'

    return user;
  }
}
