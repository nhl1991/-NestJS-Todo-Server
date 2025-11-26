import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { PrismaService } from 'src/prisma.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Module({
  controllers: [TodoController],
  providers: [TodoService, PrismaService, JwtAuthGuard],
})
export class TodoModule {}
