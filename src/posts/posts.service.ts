import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Post } from './entities/post.entity';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async create(data: any): Promise<Post> {
    const post = await this.prisma.posts.create({
      data: data,
    });

    return post;
  }

  findAll() {
    return this.prisma.posts.findMany();
  }

  async findOne(id: number) {
    const user = await this.prisma.posts.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('post not found');
    }

    return user;
  }

  async update(id: number, data: UpdatePostDto, userId: number) {
    const post = await this.findOne(id);
    if (post.authorId != userId) {
      throw new ForbiddenException('Unable to access');
    }

    const user = await this.prisma.posts.update({
      data: data,
      where: {
        id: id,
      },
    });

    return user;
  }

  async remove(id: number, userId: number) {
    const post = await this.findOne(id);
    if (post.authorId != userId) {
      throw new ForbiddenException('Unable to access');
    }

    const user = await this.prisma.posts.delete({
      where: {
        id: id,
      },
    });

    return user;
  }
}
