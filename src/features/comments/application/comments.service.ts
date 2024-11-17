import { Injectable } from '@nestjs/common';
import { CommentInputDto } from '../api/dto/input/comment.input.dto';
import { CommentOutputDto } from '../api/dto/output/comment.output.dto';
import { Comment } from '../domain/comment.entity';
import { LikeStatus } from '../../../base/types/like.statuses';
import { CommentUserLikeStatus } from '../domain/comment.like.entity';
import { UsersQueryRepo } from '../../users/infrastructure/typeorm/users.query.repo';
import { CommentsRepo } from '../infrastructure/typeorm/comments.repo';
import { CommentsQueryRepo } from '../infrastructure/typeorm/comments.query.repo';
import { CommentsLikeInfoRepo } from '../infrastructure/typeorm/comments.like.info.repo';
import { CommentatorInfo } from '../domain/commentator.entity';

@Injectable()
export class CommentsService {
  constructor(
    private readonly commentsRepo: CommentsRepo,
    private readonly commentsQueryRepo: CommentsQueryRepo,
    private readonly usersQueryRepo: UsersQueryRepo,
    private readonly commentLikeInfoRepo: CommentsLikeInfoRepo,
  ) {}

  async createComment(
    input: CommentInputDto,
    commentatorId: string,
    postId: string,
  ): Promise<CommentOutputDto> {
    const user = await this.usersQueryRepo.findUserById(commentatorId);

    const newComment = new Comment();
    newComment.postId = postId;
    newComment.content = input.content;

    const commentatorInfo = new CommentatorInfo();
    commentatorInfo.userId = user!.userId;
    commentatorInfo.userLogin = user!.login;

    const insertedComment = await this.commentsRepo.createComment(
      newComment,
      commentatorInfo,
    );
    return {
      id: insertedComment!.id,
      content: insertedComment!.content,
      commentatorInfo: {
        userId: commentatorInfo.userId,
        userLogin: commentatorInfo.userLogin,
      },
      createdAt: insertedComment!.createdAt,
      likesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None',
      },
    };
  }

  async updateComment(
    input: CommentInputDto,
    commentId: string,
  ): Promise<boolean> {
    return this.commentsRepo.updateComment(input, commentId);
  }

  async delete(commentId: string): Promise<boolean> {
    return this.commentsRepo.deleteComment(commentId);
  }

  async isUserCanDoThis(userId: string, commentId: string): Promise<boolean> {
    const comment = await this.commentsQueryRepo.findCommentById(commentId);
    return userId === comment?.commentatorInfo.userId;
  }

  async updateLikeStatus(
    commentId: string,
    userId: string,
    inputLikeStatus: LikeStatus,
  ): Promise<boolean> {
    const commentLikeInfo =
      await this.commentLikeInfoRepo.findCommentUserLikesInfo(
        commentId,
        userId,
      );
    if (!commentLikeInfo?.status) {
      const newCommentLikeInfo = new CommentUserLikeStatus();
      newCommentLikeInfo.commentId = commentId;
      newCommentLikeInfo.userId = userId;
      newCommentLikeInfo.status = inputLikeStatus;
      const createLikeInfo =
        await this.commentLikeInfoRepo.createNewLikeInfo(newCommentLikeInfo);
      const updateLikesCount =
        await this.commentLikeInfoRepo.updateAddCommentLikesCount(
          commentId,
          inputLikeStatus,
        );
      return createLikeInfo && updateLikesCount;
    }
    const updateLikeInfo =
      await this.commentLikeInfoRepo.updateCommentUserLikeStatus(
        commentId,
        userId,
        inputLikeStatus,
      );
    const updateLikesCount =
      await this.commentLikeInfoRepo.updateExistCommentLikesCount(
        commentId,
        commentLikeInfo.status as LikeStatus,
        inputLikeStatus,
      );
    return updateLikeInfo && updateLikesCount;
  }
}
