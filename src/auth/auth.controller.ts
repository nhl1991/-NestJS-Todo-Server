import {
  Controller,
  Get,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthenticatedGuard, LocalAuthGuard } from './auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @Post('register')
  // async register(@Body() dto: CreateUserDto){
  //   return await this.authService.register(dto);
  // }

  @UseGuards(LocalAuthGuard)
  @Post('login-test')
  async login(@Request() req, @Res({ passthrough: true }) res: Response) {
    
  const { access_token, email, username } = await this.authService.login(req.user);
    res.cookie('access_token', access_token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false, // https 환경이면 true
    path: '/',
    maxAge: 1000 * 60 * 5, // 일단 5분.
  })
    return { message: 'login ok', username, email };
  }

  @UseGuards(AuthenticatedGuard)
  @Get('test-guard')
  sessionsTest(@Request() req) {
    return req.user;
  }
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    console.log(req);
    return req.user;
  }
}
