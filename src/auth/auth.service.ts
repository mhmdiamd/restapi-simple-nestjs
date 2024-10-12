import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { compareSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../src/users/users.service';
import { User } from '../../src/users/entities/user.entity';
import { hashPassword } from '../../helpers/hashing';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(data: LoginDto): Promise<User> {
    const user = await this.userService.findOneByEmail(data.email);

    if (!user) {
      throw new UnauthorizedException();
    }

    if (!compareSync(data.password, user.password)) {
      throw new UnauthorizedException();
    }

    delete user.password;
    return {
      access_token: await this.jwtService.signAsync(user),
    };
  }

  async register(data: RegisterDto): Promise<User> {
    // hash password
    const hash = await hashPassword(data.password);

    try {
      // create to user
      const user = await this.userService.create({
        ...data,
        password: hash,
      });

      return user;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async getMe(email: string): Promise<User> {
    const user = await this.userService.findOneByEmail(email);

    if (user) {
      delete user.password;
    }

    return user;
  }
}
