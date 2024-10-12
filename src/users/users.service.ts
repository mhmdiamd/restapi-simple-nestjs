import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.UsersCreateInput): Promise<User> {
    const findUser = await this.findOneByEmail(data.email);
    if (findUser) {
      throw new ConflictException('email already exist');
    }

    const user = this.prisma.users.create({
      data: data,
      select: {
        name: true,
        email: true,
      },
    });

    return user;
  }

  findAll() {
    return this.prisma.users.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.users.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!user) {
      throw new NotFoundException('user not found');
    }

    return user;
  }

  findOneByEmail(email: string) {
    return this.prisma.users.findUnique({
      where: {
        email: email,
      },
    });
  }

  async update(id: number, data: UpdateUserDto) {
    await this.findOne(id);

    const user = await this.prisma.users.update({
      data: data,
      where: {
        id: id,
      },
    });

    delete user.password;

    return user;
  }

  async remove(id: number) {
    await this.findOne(id);

    const user = await this.prisma.users.delete({
      where: {
        id: id,
      },
    });

    return user;
  }
}
