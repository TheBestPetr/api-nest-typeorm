import { Injectable } from '@nestjs/common';
import { PostsRepository } from '../infrastructure/sql/posts.repository';
import { PostInputBlogDto } from '../api/dto/input/post.input.dto';
import { PostOutputDto } from '../api/dto/output/post.output.dto';
import { BlogsQueryRepository } from '../../blogs/infrastructure/sql/blogs.query.repository';
import { Post } from '../domain/post.entity';
import { LikeStatus } from '../../../base/types/like.statuses';
import { PostUserLikeStatus } from '../domain/post.like.entity';
import { PostsLikeInfoRepository } from '../infrastructure/sql/posts.like.info.repository';
import { UsersQueryRepo } from '../../users/infrastructure/typeorm/users.query.repo';

@Injectable()
export class PostsService {
  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly blogsQueryRepository: BlogsQueryRepository,
    private readonly usersQueryRepo: UsersQueryRepo,
    private readonly postsLikeInfoRepository: PostsLikeInfoRepository,
  ) {}
  async updatePost(
    blogId: string,
    postId: string,
    input: PostInputBlogDto,
  ): Promise<boolean> {
    return this.postsRepository.updatePost(blogId, postId, input);
  }

  async deletePost(blogId: string, postId: string): Promise<boolean> {
    return this.postsRepository.deletePost(blogId, postId);
  }

  async createPost(
    blogId: string,
    input: PostInputBlogDto,
  ): Promise<PostOutputDto> {
    const blog = await this.blogsQueryRepository.findBlogById(blogId);
    const createdPost = new Post();
    createdPost.title = input.title;
    createdPost.shortDescription = input.shortDescription;
    createdPost.content = input.content;
    createdPost.blogId = blog!.id;
    createdPost.blogName = blog!.name;

    const insertedPost = await this.postsRepository.createPost(createdPost);

    return {
      id: insertedPost[0].id,
      title: insertedPost[0].title,
      shortDescription: insertedPost[0].shortDescription,
      content: insertedPost[0].content,
      blogId: insertedPost[0].blogId,
      blogName: insertedPost[0].blogName,
      createdAt: insertedPost[0].createdAt,
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None',
        newestLikes: [],
      },
    };
  }

  async updateLikeStatus(
    postId: string,
    userId: string,
    inputLikeStatus: LikeStatus,
  ): Promise<boolean> {
    const postLikesInfo = await this.postsLikeInfoRepository.findPostsLikesInfo(
      postId,
      userId,
    );
    const user = await this.usersQueryRepo.findUserById(userId);
    if (!postLikesInfo[0]?.status) {
      const newPostLikeInfo = new PostUserLikeStatus();
      newPostLikeInfo.postId = postId;
      newPostLikeInfo.userId = userId;
      newPostLikeInfo.userLogin = user!.login;
      newPostLikeInfo.status = inputLikeStatus;
      const insertedLikeInfo =
        await this.postsLikeInfoRepository.createNewLikeInfo(newPostLikeInfo);
      const updateLikesCount =
        await this.postsLikeInfoRepository.updateAddPostLikesCount(
          postId,
          inputLikeStatus,
        );
      return insertedLikeInfo && updateLikesCount;
    }
    const updateLikeInfo =
      await this.postsLikeInfoRepository.updatePostLikeInfo(
        postId,
        userId,
        inputLikeStatus,
      );
    const updateLikesCount =
      await this.postsLikeInfoRepository.updateExistPostLikesCount(
        postId,
        postLikesInfo[0].status,
        inputLikeStatus,
      );
    return updateLikeInfo && updateLikesCount;
  }
}
