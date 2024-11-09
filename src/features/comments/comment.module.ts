/*
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment, CommentatorInfo } from './domain/comment.entity';
import { CommentsService } from './application/comments.service';
import { CommentsRepository } from './infrastructure/sql/comments.repository';
import { CommentsController } from './api/comments.controller';
import { JwtService } from '../../infrastructure/utils/services/jwt.service';
import { CommentsQueryRepository } from './infrastructure/sql/comments.query.repository';
import { CommentsLikeInfoRepository } from './infrastructure/sql/comments.like.info.repository';
import { CommentLikesCountInfo } from './domain/comment.like.entity';
import { UsersQueryRepo } from '../users/infrastructure/typeorm/users.query.repo';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment, CommentatorInfo, CommentLikesCountInfo]),
  ],
  controllers: [CommentsController],
  providers: [
    CommentsService,
    CommentsRepository,
    CommentsQueryRepository,
    CommentsLikeInfoRepository,
    UsersQueryRepo,
    JwtService,
  ],
  exports: [CommentsService, CommentsRepository],
})
export class CommentModule {}
*/
