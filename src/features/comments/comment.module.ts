import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment, CommentatorInfo, LikesInfo } from './domain/comment.entity';
import { UsersQueryRepository } from '../users/infrastructure/sql/users.query.repository';
import { CommentsService } from './application/comments.service';
import { CommentsRepository } from './infrastructure/sql/comments.repository';
import { CommentsController } from './api/comments.controller';
import { JwtService } from '../../infrastructure/utils/services/jwt.service';
import { CommentsQueryRepository } from './infrastructure/sql/comments.query.repository';
import { CommentsLikeInfoRepository } from './infrastructure/sql/comments.like.info.repository';

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
