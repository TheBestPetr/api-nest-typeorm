import { Injectable } from '@nestjs/common';
import { CommentsRepository } from '../infrastructure/sql/comments.repository';
import { CommentInputDto } from '../api/dto/input/comment.input.dto';
import { CommentOutputDto } from '../api/dto/output/comment.output.dto';
import { UsersQueryRepository } from '../../users/infrastructure/sql/users.query.repository';
import { Comment, CommentatorInfo } from '../domain/comment.entity';
import { CommentsQueryRepository } from '../infrastructure/sql/comments.query.repository';
import { LikeStatus } from '../../../base/types/like.statuses';
import { CommentsLikeInfoRepository } from '../infrastructure/sql/comments.like.info.repository';
import { CommentUserLikeStatus } from '../domain/comment.like.entity';

@Injectable()
export class CommentsService {
  constructor(
    private readonly commentsRepository: CommentsRepository,
    private readonly commentsQueryRepository: CommentsQueryRepository,
    private readonly usersQueryRepository: UsersQueryRepository,
    private readonly commentLikeInfoRepository: CommentsLikeInfoRepository,
  ) {}

  async createComment(
    input: CommentInputDto,
    commentatorId: string,
    postId: string,
  ): Promise<CommentOutputDto> {
    const user = await this.usersQueryRepository.findUserById(commentatorId);

    const newComment = new Comment();
    newComment.postId = postId;
    newComment.content = input.content;

    const commentatorInfo = new CommentatorInfo();
    commentatorInfo.userId = user.userId;
    commentatorInfo.userLogin = user.login;

    const insertedComment = await this.commentsRepository.createComment(
      newComment,
      commentatorInfo,
    );
    return {
      id: insertedComment.id,
      content: insertedComment.content,
      commentatorInfo: {
        userId: commentatorInfo.userId,
        userLogin: commentatorInfo.userLogin,
      },
      createdAt: insertedComment.createdAt,
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
    return this.commentsRepository.updateComment(input, commentId);
  }

  async delete(commentId: string): Promise<boolean> {
    return this.commentsRepository.deleteComment(commentId);
  }

  async isUserCanDoThis(userId: string, commentId: string): Promise<boolean> {
    const comment =
      await this.commentsQueryRepository.findCommentById(commentId);
    return userId === comment?.commentatorInfo.userId;
  }

  async updateLikeStatus(
    commentId: string,
    userId: string,
    inputLikeStatus: LikeStatus,
  ): Promise<boolean> {
    const commentLikeInfo =
      await this.commentLikeInfoRepository.findCommentsLikesInfo(
        commentId,
        userId,
      );
    const user = await this.usersQueryRepository.findUserById(userId);
    if (!commentLikeInfo[0]?.status) {
      const newCommentLikeInfo = new CommentUserLikeStatus();
      newCommentLikeInfo.commentId = commentId;
      newCommentLikeInfo.userId = user.userId;
      newCommentLikeInfo.status = inputLikeStatus;
      const createLikeInfo =
        await this.commentLikeInfoRepository.createNewLikeInfo(
          newCommentLikeInfo,
        );
      const updateLikesCount =
        await this.commentLikeInfoRepository.updateAddCommentLikesCount(
          commentId,
          inputLikeStatus,
        );
      return createLikeInfo && updateLikesCount;
    }
    const updateLikeInfo =
      await this.commentLikeInfoRepository.updateCommentLikeInfo(
        commentId,
        userId,
        inputLikeStatus,
      );
    const updateLikesCount =
      await this.commentLikeInfoRepository.updateExistCommentLikesCount(
        commentId,
        commentLikeInfo[0].status as LikeStatus,
        inputLikeStatus,
      );
    return updateLikeInfo && updateLikesCount;
  }
}
