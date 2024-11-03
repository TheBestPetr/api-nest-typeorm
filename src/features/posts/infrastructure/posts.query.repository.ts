import { Injectable } from '@nestjs/common';
import { PostInputQueryDto } from '../api/dto/input/post.input.dto';
import {
  PostOutputDto,
  PostOutputQueryDto,
} from '../api/dto/output/post.output.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { LikeStatus } from '../../../base/types/like.statuses';

@Injectable()
export class PostsQueryRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}
  async findPostsByBlogIdInParams(
    query: PostInputQueryDto,
    blogId: string,
    userId?: string,
  ): Promise<PostOutputQueryDto> {
    const items = await this.dataSource.query(
      `SELECT id, title, "shortDescription", content, "blogId", "blogName", "createdAt", "likesCount", "dislikesCount"
      FROM public.posts
      WHERE "blogId" = $1
      ORDER BY "${query.sortBy}" ${query.sortDirection}, "id" ASC
      LIMIT $2 OFFSET $3`,
      [blogId, query.pageSize, (query.pageNumber - 1) * query.pageSize],
    );
    const totalCountResult = await this.dataSource.query(
      `SELECT COUNT(*) FROM public.posts
        WHERE "blogId" = $1`,
      [blogId],
    );
    const totalCount = parseInt(totalCountResult[0].count, 10);

    const postIdsArr = items.map((post) => post.id);
    const newestLikes = await this.dataSource.query(
      `
      SELECT "postId", "userId", "userLogin", status, "createdAt"
        FROM public."postsUserLikeInfo"
        WHERE "postId" = ANY($1) AND status = 'Like'
        ORDER BY "createdAt" DESC`,
      [postIdsArr],
    );
    const groupedLikes = postIdsArr.reduce((acc, postId) => {
      acc[postId] = newestLikes
        .filter((likeInfo) => likeInfo.postId === postId)
        .slice(0, 3)
        .map((like) => ({
          addedAt: like.createdAt,
          userId: like.userId,
          login: like.userLogin,
        }));
      return acc;
    }, {});

    const status = userId
      ? await this.dataSource.query(
          `
        SELECT "postId", status
            FROM public."postsUserLikeInfo"
            WHERE "postId" = ANY($1) AND "userId" = $2`,
          [postIdsArr, userId],
        )
      : [];
    const userLikesStatusMap = status.reduce((acc, like) => {
      acc[like.postId] = like.status;
      return acc;
    }, {});
    return {
      pagesCount: Math.ceil(totalCount / query.pageSize),
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: totalCount as number,
      items: items.map((post) => ({
        id: post.id,
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt,
        extendedLikesInfo: {
          likesCount: post.likesCount,
          dislikesCount: post.dislikesCount,
          myStatus: userLikesStatusMap[post.id] || 'None',
          newestLikes: groupedLikes[post.id] || [],
        },
      })),
    };
  }

  async findPosts(
    query: PostInputQueryDto,
    userId?: string,
  ): Promise<PostOutputQueryDto> {
    const items = await this.dataSource.query(
      `SELECT id, title, "shortDescription", content, "blogId", "blogName", "createdAt", "likesCount", "dislikesCount"
      FROM public.posts
      ORDER BY "${query.sortBy}" ${query.sortDirection}, "id" ASC
      LIMIT $1 OFFSET $2`,
      [query.pageSize, (query.pageNumber - 1) * query.pageSize],
    );

    const totalCountResult = await this.dataSource.query(
      `SELECT COUNT(*) FROM public.posts`,
    );
    const totalCount = parseInt(totalCountResult[0].count, 10);

    const postIdsArr = items.map((post) => post.id);
    const newestLikes = await this.dataSource.query(
      `
      SELECT "postId", "userId", "userLogin", status, "createdAt"
        FROM public."postsUserLikeInfo"
        WHERE "postId" = ANY($1) AND status = 'Like'
        ORDER BY "createdAt" DESC`,
      [postIdsArr],
    );
    const groupedLikes = postIdsArr.reduce((acc, postId) => {
      acc[postId] = newestLikes
        .filter((likeInfo) => likeInfo.postId === postId)
        .slice(0, 3)
        .map((like) => ({
          addedAt: like.createdAt,
          userId: like.userId,
          login: like.userLogin,
        }));
      return acc;
    }, {});

    const status = userId
      ? await this.dataSource.query(
          `
        SELECT "postId", status
            FROM public."postsUserLikeInfo"
            WHERE "postId" = ANY($1) AND "userId" = $2`,
          [postIdsArr, userId],
        )
      : [];
    const userLikesStatusMap = status.reduce((acc, like) => {
      acc[like.postId] = like.status;
      return acc;
    }, {});

    return {
      pagesCount: Math.ceil(totalCount / query.pageSize),
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: totalCount,
      items: items.map((post) => ({
        id: post.id,
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt,
        extendedLikesInfo: {
          likesCount: post.likesCount,
          dislikesCount: post.dislikesCount,
          myStatus: userLikesStatusMap[post.id] || 'None',
          newestLikes: groupedLikes[post.id] || [],
        },
      })),
    };
  }

  async findPostById(
    postId: string,
    userId?: string,
  ): Promise<PostOutputDto | null> {
    const post = await this.dataSource.query(`
        SELECT id, title, "shortDescription", content, "blogId", "blogName", "createdAt", "likesCount", "dislikesCount"
        FROM public.posts
        WHERE "id" = '${postId}';`);
    if (post.length === 0) {
      return null;
    }
    let status = 'None';
    if (userId) {
      const postLikeStatus = await this.dataSource.query(`
        SELECT status
            FROM public."postsUserLikeInfo"
            WHERE "postId" = '${post[0].id}' AND "userId" = '${userId}'`);
      status = postLikeStatus.length > 0 ? postLikeStatus[0].status : 'None';
    }
    const newestLikes = await this.dataSource.query(`
      SELECT "postId", "userId", "userLogin", status, "createdAt"
            FROM public."postsUserLikeInfo"
            WHERE "postId" = '${postId}' AND "status" = 'Like'
            ORDER BY "createdAt" DESC
            LIMIT 3`);
    if (post.length > 0) {
      return {
        id: post[0].id,
        title: post[0].title,
        shortDescription: post[0].shortDescription,
        content: post[0].content,
        blogId: post[0].blogId,
        blogName: post[0].blogName,
        createdAt: post[0].createdAt,
        extendedLikesInfo: {
          likesCount: post[0].likesCount,
          dislikesCount: post[0].dislikesCount,
          myStatus: status as LikeStatus,
          newestLikes:
            newestLikes.map((like) => ({
              addedAt: like.createdAt,
              userId: like.userId,
              login: like.userLogin,
            })) || [],
        },
      };
    }
    return null;
  }
}
