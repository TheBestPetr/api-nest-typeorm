import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import {
  CommentOutputDto,
  CommentOutputQueryDto,
} from '../api/dto/output/comment.output.dto';
import { LikeStatus } from '../../../base/types/like.statuses';
import { CommentInputQueryDto } from '../api/dto/input/comment.input.dto';

@Injectable()
export class CommentsQueryRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}
  async findCommentById(
    commentId: string,
    userId?: string,
  ): Promise<CommentOutputDto | null> {
    const comment = await this.dataSource.query(
      `
        SELECT id, "postId", content, "createdAt"
            FROM public.comments
            WHERE "id" = $1`,
      [commentId],
    );
    if (comment.length === 0) {
      return null;
    }
    const commentatorInfo = await this.dataSource.query(`
        SELECT "userId", "userLogin"
            FROM public."commentsCommentatorInfo"
            WHERE "commentId" = '${comment[0].id}'`);
    const commentLikesCount = await this.dataSource.query(`
        SELECT "likesCount", "dislikesCount"
            FROM public."commentsLikesCountInfo"
            WHERE "commentId" = '${comment[0].id}'`);
    let status = 'None';
    if (userId) {
      const commentLikeStatus = await this.dataSource.query(`
        SELECT status
            FROM public."commentsUserLikeInfo"
            WHERE "commentId" = '${comment[0].id}' AND "userId" = '${userId}'`);
      status =
        commentLikeStatus.length > 0 ? commentLikeStatus[0].status : 'None';
    }
    if (comment.length > 0) {
      return {
        id: comment[0].id,
        content: comment[0].content,
        commentatorInfo: {
          userId: commentatorInfo[0].userId,
          userLogin: commentatorInfo[0].userLogin,
        },
        createdAt: comment[0].createdAt,
        likesInfo: {
          likesCount: commentLikesCount[0].likesCount,
          dislikesCount: commentLikesCount[0].dislikesCount,
          myStatus: status as LikeStatus,
        },
      };
    }
    return null;
  }

  async findCommentsForPost(
    postId: string,
    query: CommentInputQueryDto,
    userId?: string,
  ): Promise<CommentOutputQueryDto> {
    const items = await this.dataSource.query(
      `
      SELECT id, "postId", content, "createdAt"
        FROM public.comments
        WHERE "postId" = $1
        ORDER BY "${query.sortBy}" ${query.sortDirection}, "id" ASC
        LIMIT $2 OFFSET $3`,
      [postId, query.pageSize, (query.pageNumber - 1) * query.pageSize],
    );

    const commentIdsArr = items.map((comment) => comment.id);

    const commentatorInfo = await this.dataSource.query(
      `
      SELECT "commentId", "userId", "userLogin"
        FROM public."commentsCommentatorInfo"
        WHERE "commentId" = ANY($1)`,
      [commentIdsArr],
    );
    const commentatorInfoMap = commentatorInfo.reduce((acc, info) => {
      acc[info.commentId] = {
        userId: info.userId,
        userLogin: info.userLogin,
      };
      return acc;
    }, {});

    const totalCountResult = await this.dataSource.query(
      `SELECT COUNT(*) FROM public.comments
            WHERE "postId" = $1`,
      [postId],
    );
    const totalCount = parseInt(totalCountResult[0].count, 10);

    const likesCountInfo = await this.dataSource.query(
      `
      SELECT "commentId", "likesCount", "dislikesCount"
        FROM public."commentsLikesCountInfo"
        WHERE "commentId" = ANY($1)`,
      [commentIdsArr],
    );
    const likesCountMap = likesCountInfo.reduce((acc, info) => {
      acc[info.commentId] = {
        likesCount: info.likesCount,
        dislikesCount: info.dislikesCount,
      };
      return acc;
    }, {});

    const status = userId
      ? await this.dataSource.query(
          `
      SELECT "commentId", "userId", status, "createdAt"
        FROM public."commentsUserLikeInfo"
        WHERE "commentId" = ANY($1) AND "userId" = $2`,
          [commentIdsArr, userId],
        )
      : [];
    const userLikesStatusMap = status.reduce((acc, like) => {
      acc[like.commentId] = like.status;
      return acc;
    }, {});

    return {
      pagesCount: Math.ceil(totalCount / query.pageSize),
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: totalCount,
      items: items.map((comment) => ({
        id: comment.id,
        content: comment.content,
        commentatorInfo: commentatorInfoMap[comment.id],
        createdAt: comment.createdAt,
        likesInfo: {
          likesCount: likesCountMap[comment.id].likesCount,
          dislikesCount: likesCountMap[comment.id].dislikesCount,
          myStatus: userLikesStatusMap[comment.id] || 'None',
        },
      })),
    };
  }
}
