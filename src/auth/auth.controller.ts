import { Controller, Get, Post, Res, Req, UseGuards, HttpCode, HttpStatus, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  
  @HttpCode(HttpStatus.OK)
  @Post('login') 
  async signIn(@Body() signInDto: Record<string, any>, @Res({ passthrough: true /** passthrough true여야 수동 응답. */}) res:Response): Promise<any> {
    console.log(signInDto);
    const { access_token, email, username, userId } = await this.authService.signIn(signInDto.email, signInDto.password)

    res.cookie('access_token', access_token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false, // https 환경이면 true
      path: '/',
      maxAge: 1000 * 60 * 5, // 일단 5분.
    });
    // res.cookie('user', { username: username, email: email, userId: userId}, {
    //   httpOnly: true,
    //   sameSite: 'lax',
    //   secure: false, // https 환경이면 true
    //   path: '/',
    //   maxAge: 1000 * 60 * 5, // 일단 5분.
    // });
    return { message:'OK', username, email, userId };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token', { path: '/' });
    return { message: 'logout ok' };
  }
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: Request) {

    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Req() req:Request){
    return req.user
  }
}
