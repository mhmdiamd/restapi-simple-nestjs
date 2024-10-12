import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { AuthGuard } from './guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  ResponseSuccess(data: any, statusCode: number = 200) {
    return {
      statusCode: 200,
      message: 'success',
      data: data,
    };
  }

  @Post('login')
  async login(@Body() data: LoginDto) {
    const user = await this.authService.login(data);
    return this.ResponseSuccess(user);
  }

  @Post('register')
  async register(@Body() data: RegisterDto) {
    const user = await this.authService.register(data);
    return this.ResponseSuccess(user);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  async getProfile(@Request() req: Request) {
    const user = await this.authService.getMe(req['user'].email);
    return this.ResponseSuccess(user);
  }
}
