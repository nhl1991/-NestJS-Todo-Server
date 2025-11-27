import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    email: string,
    pass: string,
  ): Promise<{
    email: string;
    username: string;
    access_token: string;
    userId: number;
  }> {
    const user = await this.userService.getUser(email);

    if (user && bcrypt.compareSync(pass, user.password)) {
      const payload = { sub: user, email: user.email };
      const access_token = await this.jwtService.signAsync(payload);
      return {
        access_token,
        email: user.email,
        username: user.username,
        userId: user.id,
      };
    }

    throw new UnauthorizedException();
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.getUser(email);

    if (user && bcrypt.compareSync(pass, user.password)) {
      return user;
    }

    return null;
  }

  async login(user: { username: string; email: string; password: string }) {
    const payload = { username: user.username, sub: { ...user } };

    return {
      username: payload.username,
      email: payload.sub.email,
      access_token: this.jwtService.sign(payload),
    };
  }
}
