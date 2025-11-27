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
  create(@Body() createTodoDto: CreateTodoDto, @Req() req: Request) {
    const user = req.cookies['user'];

    return this.todoService.create({
      ...createTodoDto,
      User: {
        connect: { id: user.userId },
      },
    });
  }

  // 모든 게시글 (public true)
  @Get()
  findAll() {
    return this.todoService.findAll();
  }

  // 게시글 검색
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.todoService.findOne(+id);
  }

  // 게시글 수정
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTodoDto: UpdateTodoDto,
    @Req() req: Request,
  ) {
    const user = req.cookies['user'];

    return this.todoService.update(+id, updateTodoDto, user.userId);
  }

  // 게시글 삭제
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.todoService.delete(+id);
  }
}
