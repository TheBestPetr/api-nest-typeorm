import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../../domain/post.entity';
import { In, Repository } from 'typeorm';
import { PostInputQueryDto } from '../../api/dto/input/post.input.dto';
import {
  PostOutputDto,
  PostOutputQueryDto,
} from '../../api/dto/output/post.output.dto';
import {
  PostLikesCountInfo,
  PostUserLikeStatus,
} from '../../domain/post.like.entity';
import { LikeStatus } from '../../../../base/types/like.statuses';

@Injectable()
export class PostsQueryRepo {
  constructor(
    @InjectRepository(Post) private readonly postsQueryRepo: Repository<Post>,
    @InjectRepository(PostUserLikeStatus)
    private readonly postUserLikeStatusRepo: Repository<PostUserLikeStatus>,
    @InjectRepository(PostLikesCountInfo)
    private readonly postLikesCountRepo: Repository<PostLikesCountInfo>,
  ) {}

  async findPostsByBlogIdInParams(
    query: PostInputQueryDto,
    blogId: string,
    userId?: string,
  ): Promise<PostOutputQueryDto> {
    const [items, count] = await this.postsQueryRepo.findAndCount({
      where: { blogId: blogId },
      order: { [query.sortBy]: query.sortDirection },
      take: query.pageSize,
      skip: (query.pageNumber - 1) * query.pageSize,
    });
    const postIdsArr = items.map((post) => post.id);
    const likesCountInfo = await this.postLikesCountRepo.find({
      where: { postId: In(postIdsArr) },
    });
    const likesCountInfoMap = likesCountInfo.reduce((acc, info) => {
      acc[info.postId] = {
        likesCount: info.likesCount,
        dislikesCount: info.dislikesCount,
      };
      return acc;
    }, {});

    const likeStatuses = userId
      ? await this.postUserLikeStatusRepo.find({
          where: { postId: In(postIdsArr), userId: userId },
        })
      : [];
    const userLikesStatusMap = likeStatuses.reduce((acc, like) => {
      acc[like.postId] = like.status;
      return acc;
    }, {});
    const newestLikes = await this.postUserLikeStatusRepo.find({
      where: { postId: In(postIdsArr), status: 'Like' },
    });
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

    return {
      pagesCount: Math.ceil(count / query.pageSize),
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: count,
      items: items.map((post) => ({
        id: post.id,
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt,
        extendedLikesInfo: {
          likesCount: likesCountInfoMap[post.id].likesCount,
          dislikesCount: likesCountInfoMap[post.id].dislikesCount,
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
    const [items, count] = await this.postsQueryRepo.findAndCount({
      order: { [query.sortBy]: query.sortDirection },
      take: query.pageSize,
      skip: (query.pageNumber - 1) * query.pageSize,
    });
    const postIdsArr = items.map((post) => post.id);
    const likesCountInfo = await this.postLikesCountRepo.find({
      where: { postId: In(postIdsArr) },
    });
    const likesCountInfoMap = likesCountInfo.reduce((acc, info) => {
      acc[info.postId] = {
        likesCount: info.likesCount,
        dislikesCount: info.dislikesCount,
      };
      return acc;
    }, {});
    const likeStatuses = userId
      ? await this.postUserLikeStatusRepo.find({
          where: { postId: In(postIdsArr), userId: userId },
        })
      : [];
    const userLikesStatusMap = likeStatuses.reduce((acc, like) => {
      acc[like.postId] = like.status;
      return acc;
    }, {});
    const newestLikes = await this.postUserLikeStatusRepo.find({
      where: { postId: In(postIdsArr), status: 'Like' },
    });
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

    return {
      pagesCount: Math.ceil(count / query.pageSize),
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: count,
      items: items.map((post) => ({
        id: post.id,
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt,
        extendedLikesInfo: {
          likesCount: likesCountInfoMap[post.id].likesCount,
          dislikesCount: likesCountInfoMap[post.id].dislikesCount,
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
    const post = await this.postsQueryRepo.findOneBy({ id: postId });
    let status = 'None';
    if (userId) {
      const likeStatus = await this.postUserLikeStatusRepo.findOneBy([
        { postId: postId },
        { userId: userId },
      ]);
      status = likeStatus?.status ?? 'None';
    }
    const likesInfo = await this.postLikesCountRepo.findOneBy({
      postId: postId,
    });
    const newestLikes = await this.postUserLikeStatusRepo.find({
      where: { postId: post?.id, status: 'Like' },
      order: { createdAt: 'desc' },
      take: 3,
    });
    const newestLikesMap = newestLikes.map((like) => ({
      addedAt: like.createdAt,
      userId: like.userId,
      login: like.userLogin,
    }));

    return post
      ? {
          id: post.id,
          title: post.title,
          shortDescription: post.shortDescription,
          content: post.content,
          blogId: post.blogId,
          blogName: post.blogName,
          createdAt: post.createdAt,
          extendedLikesInfo: {
            likesCount: likesInfo!.likesCount,
            dislikesCount: likesInfo!.dislikesCount,
            myStatus: status as LikeStatus,
            newestLikes: newestLikesMap || [],
          },
        }
      : null;
  }
}
