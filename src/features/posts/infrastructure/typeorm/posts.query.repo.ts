import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../../domain/post.entity';
import { Repository } from 'typeorm';
import { PostInputQueryDto } from '../../api/dto/input/post.input.dto';
import {
  PostOutputDto,
  PostOutputQueryDto,
} from '../../api/dto/output/post.output.dto';

@Injectable()
export class PostsQueryRepo {
  constructor(
    @InjectRepository(Post) private readonly postsQueryRepo: Repository<Post>,
  ) {}

  async findPostsByBlogIdInParams(
    query: PostInputQueryDto,
    blogId: string,
    //userId?: string,
  ): Promise<PostOutputQueryDto> {
    const [items, count] = await this.postsQueryRepo.findAndCount({
      where: { blogId: blogId },
      order: { [query.sortBy]: query.sortDirection },
      take: query.pageSize,
      skip: (query.pageNumber - 1) * query.pageSize,
    });

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
          likesCount: 0,
          dislikesCount: 0,
          myStatus: 'None',
          newestLikes: [],
        },
      })),
    };
  }

  async findPosts(
    query: PostInputQueryDto,
    //userId?: string,
  ): Promise<PostOutputQueryDto> {
    const [items, count] = await this.postsQueryRepo.findAndCount({
      order: { [query.sortBy]: query.sortDirection },
      take: query.pageSize,
      skip: (query.pageNumber - 1) * query.pageSize,
    });

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
          likesCount: 0,
          dislikesCount: 0,
          myStatus: 'None',
          newestLikes: [],
        },
      })),
    };
  }

  async findPostById(
    postId: string,
    //userId?: string,
  ): Promise<PostOutputDto | null> {
    const post = await this.postsQueryRepo.findOneBy({ id: postId });

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
            likesCount: 0,
            dislikesCount: 0,
            myStatus: 'None',
            newestLikes: [],
          },
        }
      : null;
  }
}
