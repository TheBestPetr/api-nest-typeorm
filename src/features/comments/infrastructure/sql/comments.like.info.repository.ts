import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CommentUserLikeStatus } from '../../domain/comment.like.entity';
import { LikeStatus } from '../../../../base/types/like.statuses';

@Injectable()
export class CommentsLikeInfoRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}
  async findCommentsLikesInfo(commentId: string, userId: string) {
    return this.dataSource.query(
      `SELECT "commentId", "userId", status, "createdAt"
        FROM public."commentsUserLikeInfo"
        WHERE "commentId" = $1 AND "userId" = $2`,
      [commentId, userId],
    );
  }

  async createNewLikeInfo(
    commentLikeInfo: CommentUserLikeStatus,
  ): Promise<boolean> {
    return this.dataSource.query(
      `INSERT INTO public."commentsUserLikeInfo"(
            "commentId", "userId", status)
            VALUES ($1, $2, $3)
            RETURNING *`,
      [
        commentLikeInfo.commentId,
        commentLikeInfo.userId,
        commentLikeInfo.status,
      ],
    );
  }

  async updateAddCommentLikesCount(
    commentId: string,
    likeStatus: LikeStatus,
  ): Promise<boolean> {
    if (likeStatus === 'Like') {
      await this.dataSource.query(
        `UPDATE public."commentsLikesCountInfo"
            SET "likesCount" = "likesCount" + 1
            WHERE "commentId" = $1;`,
        [commentId],
      );
      return true;
    }
    if (likeStatus === 'Dislike') {
      await this.dataSource.query(
        `UPDATE public."commentsLikesCountInfo"
            SET "dislikesCount" = "dislikesCount" + 1
            WHERE "commentId" = $1;`,
        [commentId],
      );
      return true;
    }
    return false;
  }

  async updateCommentLikeInfo(
    commentId: string,
    userId: string,
    newStatus: LikeStatus,
  ): Promise<boolean> {
    const result = await this.dataSource.query(
      `UPDATE public."commentsUserLikeInfo"
            SET status = $1
            WHERE "commentId" = $2 AND "userId" = $3;`,
      [newStatus, commentId, userId],
    );
    return result[1] === 1;
  }

  async updateExistCommentLikesCount(
    commentId: string,
    oldStatus: LikeStatus,
    newStatus: LikeStatus,
  ): Promise<boolean> {
    if (oldStatus === 'Like' && newStatus === 'Dislike') {
      await this.dataSource.query(
        `
        UPDATE public."commentsLikesCountInfo"
            SET "likesCount" = "likesCount" - 1, "dislikesCount" = "dislikesCount" + 1
            WHERE "commentId" = $1;`,
        [commentId],
      );
      return true;
    }
    if (oldStatus === 'Like' && newStatus === 'None') {
      await this.dataSource.query(
        `
        UPDATE public."commentsLikesCountInfo"
            SET "likesCount" = "likesCount" -1
            WHERE "commentId" = $1;`,
        [commentId],
      );
      return true;
    }
    if (oldStatus === 'Dislike' && newStatus === 'Like') {
      await this.dataSource.query(
        `
        UPDATE public."commentsLikesCountInfo"
            SET "likesCount" = "likesCount" +1, "dislikesCount" = "dislikesCount" -1
            WHERE "commentId" = $1;`,
        [commentId],
      );
      return true;
    }
    if (oldStatus === 'Dislike' && newStatus === 'None') {
      await this.dataSource.query(
        `
        UPDATE public."commentsLikesCountInfo"
            SET "dislikesCount" = "dislikesCount" -1
            WHERE "commentId" = $1;`,
        [commentId],
      );
      return true;
    }
    return oldStatus === newStatus;
  }
}
