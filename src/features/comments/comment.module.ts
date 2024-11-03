import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment, CommentatorInfo, LikesInfo } from './domain/comment.entity';
import { UsersQueryRepository } from '../users/infrastructure/users.query.repository';
import { CommentsService } from './application/comments.service';
import { CommentsRepository } from './infrastructure/comments.repository';
import { CommentsController } from './api/comments.controller';
import { JwtService } from '../../infrastructure/utils/services/jwt.service';
import { CommentsQueryRepository } from './infrastructure/comments.query.repository';
import { CommentsLikeInfoRepository } from './infrastructure/comments.like.info.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, CommentatorInfo, LikesInfo])],
  controllers: [CommentsController],
  providers: [
    CommentsService,
    CommentsRepository,
    CommentsQueryRepository,
    CommentsLikeInfoRepository,
    UsersQueryRepository,
    JwtService,
  ],
  exports: [CommentsService, CommentsRepository],
})
export class CommentModule {}
