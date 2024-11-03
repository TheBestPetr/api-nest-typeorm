import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from './domain/blog.entity';
import { BlogsService } from './application/blogs.service';
import { BlogsRepository } from './infrastructure/blogs.repository';
import { BlogsQueryRepository } from './infrastructure/blogs.query.repository';
import { PostsService } from '../posts/application/posts.service';
import { PostsQueryRepository } from '../posts/infrastructure/posts.query.repository';
import { SaBlogsController } from './api/sa.blogs.controller';
import { PostsRepository } from '../posts/infrastructure/posts.repository';
import { BlogsController } from './api/blogs.controller';
import { UsersQueryRepository } from '../users/infrastructure/users.query.repository';
import { PostsLikeInfoRepository } from '../posts/infrastructure/posts.like.info.repository';
import { JwtService } from '../../infrastructure/utils/services/jwt.service';

@Module({
  imports: [TypeOrmModule.forFeature([Blog])],
  controllers: [SaBlogsController, BlogsController],
  providers: [
    BlogsService,
    BlogsRepository,
    BlogsQueryRepository,
    PostsService,
    PostsQueryRepository,
    PostsRepository,
    UsersQueryRepository,
    PostsLikeInfoRepository,
    JwtService,
  ],
  exports: [BlogsQueryRepository],
})
export class BlogModule {}
