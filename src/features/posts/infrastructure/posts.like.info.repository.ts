import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { LikeStatus } from '../../../base/types/like.statuses';
import { PostLikeEntity } from '../domain/post.like.entity';

@Injectable()
export class PostsLikeInfoRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async findPostsLikesInfo(postId: string, userId: string) {
    return this.dataSource.query(
      `SELECT "postId", "userId", "userLogin", status, "createdAt"
        FROM public."postsUserLikeInfo"
        WHERE "postId" = $1 AND "userId" = $2`,
      [postId, userId],
    );
  }

  async createNewLikeInfo(postLikeInfo: PostLikeEntity): Promise<boolean> {
    return this.dataSource.query(
      `INSERT INTO public."postsUserLikeInfo"(
            "postId", "userId", "userLogin", status)
            VALUES ($1, $2, $3, $4)
            RETURNING *`,
      [
        postLikeInfo.postId,
        postLikeInfo.userId,
        postLikeInfo.userLogin,
        postLikeInfo.status,
      ],
    );
  }

  async updateAddPostLikesCount(
    postId: string,
    likeStatus: LikeStatus,
  ): Promise<boolean> {
    if (likeStatus === 'Like') {
      await this.dataSource.query(
        `UPDATE public.posts
            SET "likesCount" = "likesCount" + 1
            WHERE "id" = $1;`,
        [postId],
      );
      return true;
    }
    if (likeStatus === 'Dislike') {
      await this.dataSource.query(
        `UPDATE public.posts
            SET "dislikesCount" = "dislikesCount" + 1
            WHERE "id" = $1;`,
        [postId],
      );
      return true;
    }
    return false;
  }

  async updatePostLikeInfo(
    postId: string,
    userId: string,
    newStatus: LikeStatus,
  ): Promise<boolean> {
    const result = await this.dataSource.query(
      `UPDATE public."postsUserLikeInfo"
            SET status = $1
            WHERE "postId" = $2 AND "userId" = $3;`,
      [newStatus, postId, userId],
    );
    return result;
  }

  async updateExistPostLikesCount(
    postId: string,
    oldStatus: LikeStatus,
    newStatus: LikeStatus,
  ): Promise<boolean> {
    if (oldStatus === 'Like' && newStatus === 'Dislike') {
      await this.dataSource.query(
        `
        UPDATE public.posts
            SET "likesCount" = "likesCount" - 1, "dislikesCount" = "dislikesCount" + 1
            WHERE "id" = $1;`,
        [postId],
      );
      return true;
    }
    if (oldStatus === 'Like' && newStatus === 'None') {
      await this.dataSource.query(
        `
        UPDATE public.posts
            SET "likesCount" = "likesCount" -1
            WHERE "id" = $1;`,
        [postId],
      );
      return true;
    }
    if (oldStatus === 'Dislike' && newStatus === 'Like') {
      await this.dataSource.query(
        `
        UPDATE public.posts
            SET "likesCount" = "likesCount" +1, "dislikesCount" = "dislikesCount" -1
            WHERE "id" = $1;`,
        [postId],
      );
      return true;
    }
    if (oldStatus === 'Dislike' && newStatus === 'None') {
      await this.dataSource.query(
        `
        UPDATE public.posts
            SET "dislikesCount" = "dislikesCount" -1
            WHERE "id" = $1;`,
        [postId],
      );
      return true;
    }
    return oldStatus === newStatus;
  }
}
