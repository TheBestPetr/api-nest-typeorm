/*
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './domain/post.entity';
import { PostsService } from './application/posts.service';
import { PostsController } from './api/posts.controller';
import { CommentsService } from '../comments/application/comments.service';
import { CommentsRepository } from '../comments/infrastructure/sql/comments.repository';
import { JwtService } from '../../infrastructure/utils/services/jwt.service';
import { PostsLikeInfoRepository } from './infrastructure/sql/posts.like.info.repository';
import { CommentsQueryRepository } from '../comments/infrastructure/sql/comments.query.repository';
import { CommentsLikeInfoRepository } from '../comments/infrastructure/sql/comments.like.info.repository';
import {
  PostLikesCountInfo,
  PostUserLikeStatus,
} from './domain/post.like.entity';
import { UserModule } from '../users/user.module';
import { BlogModule } from '../blogs/blog.module';
import { PostsRepo } from './infrastructure/typeorm/posts.repo';
import { PostsQueryRepo } from './infrastructure/typeorm/posts.query.repo';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Post /!*, PostUserLikeStatus, PostLikesCountInfo*!/,
    ]),
    UserModule,
    //BlogModule,
  ],
  controllers: [PostsController],
  providers: [
    PostsService,
    PostsRepo,
    PostsQueryRepo,
    CommentsService,
    CommentsRepository,
    CommentsQueryRepository,
    CommentsLikeInfoRepository,
    PostsLikeInfoRepository,
    JwtService,
  ],
  exports: [PostsService, PostsQueryRepo, PostsRepo],
})
export class PostModule {}
*/
