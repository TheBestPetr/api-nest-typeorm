import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../../domain/post.entity';
import { In, Repository } from 'typeorm';
import { PostInputQueryDto } from '../../api/dto/input/post.input.dto';
import {
  PostOutputDto,
  PostOutputQueryDto,
} from '../../api/dto/output/post.output.dto';
import { PostUserLikeStatus } from '../../domain/post.like.entity';
import { LikeStatus } from '../../../../base/types/like.statuses';

@Injectable()
export class PostsQueryRepo {
  constructor(
    @InjectRepository(Post) private readonly postsQueryRepo: Repository<Post>,
    @InjectRepository(PostUserLikeStatus)
    private readonly postUserLikeStatusRepo: Repository<PostUserLikeStatus>,
  ) {}

  async findPostsByBlogIdInParams(
    query: PostInputQueryDto,
    blogId: string,
    userId?: string,
  ): Promise<PostOutputQueryDto> {
    const [items, count] = await this.postsQueryRepo.findAndCount({
      where: { blogId: blogId },
      relations: { likesCountInfo: true },
      order: { [query.sortBy]: query.sortDirection },
      take: query.pageSize,
      skip: (query.pageNumber - 1) * query.pageSize,
    });

    const postIds = items.map((post) => post.id);

    const likeStatuses = await this.postUserLikeStatusRepo.findBy({
      postId: In(postIds),
      userId: userId,
    });
    const userLikesStatusMap = likeStatuses.reduce((acc, likeInfo) => {
      acc[likeInfo.postId] = likeInfo.status;
      return acc;
    }, {});

    const newestLikes = await this.postUserLikeStatusRepo
      .createQueryBuilder('s')
      .select('s.*')
      .addSelect('s_with_rn.rn')
      .leftJoin(
        (subQuery) => {
          return subQuery
            .select('s.*')
            .addSelect(
              'ROW_NUMBER() OVER(PARTITION BY s."postId" ORDER BY s."createdAt" DESC)',
              'rn',
            )
            .from('post_likes_status_info', 's')
            .where('s."postId" IN (:...postIds)', { postIds })
            .andWhere('s.status = :status', { status: 'Like' });
        },
        's_with_rn',
        's."postId" = s_with_rn."postId" AND s."userId" = s_with_rn."userId"',
      )
      .where('s_with_rn.rn <= 3')
      .getRawMany();
    const groupedLikes = newestLikes.reduce((acc, like) => {
      if (!acc[like.postId]) {
        acc[like.postId] = [];
      }
      acc[like.postId].push({
        addedAt: like.createdAt,
        userId: like.userId,
        login: like.userLogin,
      });
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
          likesCount: post.likesCountInfo.likesCount,
          dislikesCount: post.likesCountInfo.dislikesCount,
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
      relations: { likesCountInfo: true },
      order: { [query.sortBy]: query.sortDirection },
      take: query.pageSize,
      skip: (query.pageNumber - 1) * query.pageSize,
    });
    const postIds = items.map((post) => post.id);

    const likeStatuses = await this.postUserLikeStatusRepo.findBy({
      postId: In(postIds),
      userId: userId,
    });
    const userLikesStatusMap = likeStatuses.reduce((acc, likeInfo) => {
      acc[likeInfo.postId] = likeInfo.status;
      return acc;
    }, {});

    const newestLikes = await this.postUserLikeStatusRepo
      .createQueryBuilder('s')
      .select('s.*')
      .addSelect('s_with_rn.rn')
      .leftJoin(
        (subQuery) => {
          return subQuery
            .select('s.*')
            .addSelect(
              'ROW_NUMBER() OVER(PARTITION BY s."postId" ORDER BY s."createdAt" DESC)',
              'rn',
            )
            .from('post_likes_status_info', 's')
            .where('s."postId" IN (:...postIds)', { postIds })
            .andWhere('s.status = :status', { status: 'Like' });
        },
        's_with_rn',
        's."postId" = s_with_rn."postId" AND s."userId" = s_with_rn."userId"',
      )
      .where('s_with_rn.rn <= 3')
      .getRawMany();
    const groupedLikes = newestLikes.reduce((acc, like) => {
      if (!acc[like.postId]) {
        acc[like.postId] = [];
      }
      acc[like.postId].push({
        addedAt: like.createdAt,
        userId: like.userId,
        login: like.userLogin,
      });
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
          likesCount: post.likesCountInfo.likesCount,
          dislikesCount: post.likesCountInfo.dislikesCount,
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
    const post = await this.postsQueryRepo.findOne({
      where: { id: postId },
      relations: { likesCountInfo: true },
    });

    let status = 'None';
    if (userId) {
      const likeStatus = await this.postUserLikeStatusRepo.findOneBy({
        postId: postId,
        userId: userId,
      });
      status = likeStatus?.status ?? 'None';
    }

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
            likesCount: post.likesCountInfo.likesCount,
            dislikesCount: post.likesCountInfo.dislikesCount,
            myStatus: status as LikeStatus,
            newestLikes: newestLikesMap || [],
          },
        }
      : null;
  }
}
