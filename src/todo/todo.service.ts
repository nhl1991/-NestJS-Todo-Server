import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Prisma, Todo } from 'src/generated/prisma/client';

@Injectable()
export class TodoService {
  constructor(private prisma: PrismaService) {}

  async create(todo: Prisma.TodoCreateInput): Promise<Todo> {
    try {
      return await this.prisma.todo.create({ data: todo });
    } catch (err) {
      throw err;
    }
  }

  async findAll() {
    try {
      return await this.prisma.todo.findMany();
    } catch (err) {
      throw err;
    }
  }

  async findOne(id: number) {
    try {
      return await this.prisma.todo.findUnique({
        where: {
          id: id,
        },
      });
    } catch (err) {
      throw err;
    }
  }

  async update(
    id: number,
    updateTodoDto: Prisma.TodoUpdateInput,
    userId: number,
  ) {
    try {
      const todo = await this.findOne(id);
      if (!todo) throw new NotFoundException('게시물 없음');

      if (todo.authorId === userId) {
        await this.prisma.todo.update({
          where: {
            id: id,
          },
          data: {
            ...updateTodoDto,
          },
        });
      }
    } catch (err) {
      throw err;
    }
  }

  async delete(id: number) {
    try {
      return await this.prisma.todo.delete({
        where: {
          id: id,
        },
      });
    } catch (err) {
      throw err;
    }

    return `This action removes a #${id} todo`;
  }
}
