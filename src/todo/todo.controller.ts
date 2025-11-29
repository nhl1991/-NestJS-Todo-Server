import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request } from 'express';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  // 게시글 생성
  @UseGuards(JwtAuthGuard)
  @Post('/create')
  async create(@Body() createTodoDto: CreateTodoDto, @Req() req: Request) {
    const { userId, ...data } = createTodoDto;

    return await this.todoService.create({
      ...data,
      User: {
        connect: { id: userId },
      },
    });
  }

  // 모든 게시글 (public true)
  @Get()
  async findAll() {
    return await this.todoService.findAll();
  }

  // 게시글 검색
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.todoService.findOne(+id);
  }

  @Get('my-todo/:id')
  getUserTodos(@Param('id') id: string) {
    return this.todoService.getUserTodos(+id);
  }

  // 게시글 수정
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTodoDto: UpdateTodoDto,
    @Req() req,
  ) {
    if (req.user) {
      const { userId } = req.user;

      return this.todoService.update(+id, updateTodoDto, +userId);
    }
  }

  // 게시글 삭제
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: string, @Req() req) {
    if (req.user) {
      const { userId } = req.user;
      return this.todoService.delete(+id, +userId);
    }
  }
}
