/*
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from './domain/blog.entity';
import { BlogsService } from './application/blogs.service';
import { PostsService } from '../posts/application/posts.service';
import { SaBlogsController } from './api/sa.blogs.controller';
import { BlogsController } from './api/blogs.controller';
import { PostsLikeInfoRepository } from '../posts/infrastructure/sql/posts.like.info.repository';
import { JwtService } from '../../infrastructure/utils/services/jwt.service';
import { UserModule } from '../users/user.module';
import { BlogsQueryRepo } from './infrastructure/typeorm/blogs.query.repo';
import { BlogsRepo } from './infrastructure/typeorm/blogs.repo';
import { PostsRepo } from '../posts/infrastructure/typeorm/posts.repo';
import { PostModule } from '../posts/post.module';
import { PostsQueryRepo } from '../posts/infrastructure/typeorm/posts.query.repo';

@Module({
  imports: [TypeOrmModule.forFeature([Blog]), UserModule, PostModule],
  controllers: [SaBlogsController, BlogsController],
  providers: [
    BlogsService,
    BlogsRepo,
    BlogsQueryRepo,
    PostsService,
    PostsQueryRepository,
    PostsRepository,
    PostsLikeInfoRepository,
    JwtService,
  ],
  exports: [BlogsQueryRepo],
})
export class BlogModule {}
*/
