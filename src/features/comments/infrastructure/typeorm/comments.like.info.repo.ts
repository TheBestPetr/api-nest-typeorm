import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CommentLikesCountInfo,
  CommentUserLikeStatus,
} from '../../domain/comment.like.entity';
import { Repository } from 'typeorm';
import { LikeStatus } from '../../../../base/types/like.statuses';

@Injectable()
export class CommentsLikeInfoRepo {
  constructor(
    @InjectRepository(CommentLikesCountInfo)
    private readonly commentLikesCountRepo: Repository<CommentLikesCountInfo>,
    @InjectRepository(CommentUserLikeStatus)
    private readonly commentUserLikeStatus: Repository<CommentUserLikeStatus>,
  ) {}

  async findCommentUserLikesInfo(
    commentId: string,
    userId: string,
  ): Promise<CommentUserLikeStatus | null> {
    const likeInfo = await this.commentUserLikeStatus.findOneBy([
      { commentId: commentId },
      { userId: userId },
    ]);
    return likeInfo ?? null;
  }

  async createNewLikeInfo(
    commentLikeInfo: CommentUserLikeStatus,
  ): Promise<boolean> {
    const newLikeInfo = await this.commentUserLikeStatus.save(commentLikeInfo);
    return !!newLikeInfo;
  }

  async updateAddCommentLikesCount(
    commentId: string,
    likeStatus: LikeStatus,
  ): Promise<boolean> {
    const commentLikesCountInfo = await this.commentLikesCountRepo.findOneBy({
      commentId: commentId,
    });
    if (!commentLikesCountInfo) {
      return false;
    }
    switch (likeStatus) {
      case 'Like':
        commentLikesCountInfo.likesCount++;
        await this.commentLikesCountRepo.save(commentLikesCountInfo);
        return true;
      case 'Dislike':
        commentLikesCountInfo.dislikesCount++;
        await this.commentLikesCountRepo.save(commentLikesCountInfo);
        return true;
    }
    return true;
  }

  async updateCommentUserLikeStatus(
    commentId: string,
    userId: string,
    newStatus: LikeStatus,
  ): Promise<boolean> {
    const commentUserLikeStatus = await this.commentUserLikeStatus.findOneBy([
      { commentId: commentId },
      { userId: userId },
    ]);
    if (!commentUserLikeStatus) {
      return false;
    }
    commentUserLikeStatus.status = newStatus;
    await this.commentUserLikeStatus.save(commentUserLikeStatus);
    return true;
  }

  async updateExistCommentLikesCount(
    commentId: string,
    oldStatus: LikeStatus,
    newStatus: LikeStatus,
  ): Promise<boolean> {
    const commentLikesCountInfo = await this.commentLikesCountRepo.findOneBy({
      commentId: commentId,
    });
    if (!commentLikesCountInfo) {
      return false;
    }
    if (oldStatus === 'Like' && newStatus === 'Dislike') {
      commentLikesCountInfo.likesCount--;
      commentLikesCountInfo.dislikesCount++;
      await this.commentLikesCountRepo.save(commentLikesCountInfo);
      return true;
    }
    if (oldStatus === 'Like' && newStatus === 'None') {
      commentLikesCountInfo.likesCount--;
      await this.commentLikesCountRepo.save(commentLikesCountInfo);
      return true;
    }
    if (oldStatus === 'Dislike' && newStatus === 'Like') {
      commentLikesCountInfo.dislikesCount--;
      commentLikesCountInfo.likesCount++;
      await this.commentLikesCountRepo.save(commentLikesCountInfo);
      return true;
    }
    if (oldStatus === 'Dislike' && newStatus === 'None') {
      commentLikesCountInfo.dislikesCount--;
      await this.commentLikesCountRepo.save(commentLikesCountInfo);
      return true;
    }
    return oldStatus === newStatus;
  }
}
