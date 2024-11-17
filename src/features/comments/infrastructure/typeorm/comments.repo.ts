import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from '../../domain/comment.entity';
import { Repository } from 'typeorm';
import {
  CommentLikesCountInfo,
  CommentUserLikeStatus,
} from '../../domain/comment.like.entity';
import { CommentInputDto } from '../../api/dto/input/comment.input.dto';
import { CommentatorInfo } from '../../domain/commentator.entity';

@Injectable()
export class CommentsRepo {
  constructor(
    @InjectRepository(Comment)
    private readonly commentsRepo: Repository<Comment>,
    @InjectRepository(CommentatorInfo)
    private readonly commentatorInfoRepo: Repository<CommentatorInfo>,
    @InjectRepository(CommentLikesCountInfo)
    private readonly commentLikesCountRepo: Repository<CommentLikesCountInfo>,
    @InjectRepository(CommentUserLikeStatus)
    private readonly commentUserLikeStatusRepo: Repository<CommentUserLikeStatus>,
  ) {}

  async createComment(
    inputComment: Comment,
    inputCommentatorInfo: CommentatorInfo,
  ): Promise<Comment | null> {
    const insertedComment = await this.commentsRepo.save(inputComment);
    await this.commentatorInfoRepo.save({
      commentId: insertedComment.id,
      userId: inputCommentatorInfo.userId,
      userLogin: inputCommentatorInfo.userLogin,
    });
    await this.commentLikesCountRepo.save({ commentId: insertedComment.id });
    return insertedComment ?? null;
  }

  async updateComment(
    input: CommentInputDto,
    commentId: string,
  ): Promise<boolean> {
    const comment = await this.commentsRepo.findOneBy({ id: commentId });
    if (comment) {
      comment.content = input.content;
      await this.commentsRepo.save(comment);
    }
    return !!comment;
  }

  async deleteComment(commentId: string): Promise<boolean> {
    const isCommentLikesCountDeleted = await this.commentLikesCountRepo.delete({
      commentId: commentId,
    });
    const isUserLikeStatusesDeleted =
      await this.commentUserLikeStatusRepo.delete({ commentId: commentId });
    const isCommentatorInfoDeleted = await this.commentatorInfoRepo.delete({
      commentId: commentId,
    });
    const isCommentDeleted = await this.commentsRepo.delete({ id: commentId });
    return (
      isCommentDeleted.affected === 1 ||
      isCommentLikesCountDeleted.affected === 1 ||
      isUserLikeStatusesDeleted.affected === 1 ||
      isCommentatorInfoDeleted.affected === 1
    );
  }
}
