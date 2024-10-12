import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  ResponseSuccess(data: any, statusCode: number = 200) {
    return {
      statusCode: statusCode,
      message: 'success',
      data: data,
    };
  }

  @UseGuards(AuthGuard)
  @Post()
  async create(@Request() req: Request, @Body() createPostDto: CreatePostDto) {
    const data = { ...createPostDto, authorId: req['user'].id };
    // createPostDto.authorId = +req['user'].id;
    const post = await this.postsService.create(data);
    return post;
  }

  @Get()
  async findAll() {
    const posts = await this.postsService.findAll();
    return this.ResponseSuccess(posts);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const post = await this.postsService.findOne(+id);
    return this.ResponseSuccess(post);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(
    @Request() req: Request,
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    const post = await this.postsService.update(
      +id,
      updatePostDto,
      req['user'].id,
    );

    return this.ResponseSuccess(post);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req: Request) {
    const userId = req['user'].id;
    const post = await this.postsService.remove(+id, userId);
    return this.ResponseSuccess(post);
  }
}
