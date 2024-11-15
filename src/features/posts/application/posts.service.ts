import { Injectable } from '@nestjs/common';
import { PostInputBlogDto } from '../api/dto/input/post.input.dto';
import { PostOutputDto } from '../api/dto/output/post.output.dto';
import { Post } from '../domain/post.entity';
import { LikeStatus } from '../../../base/types/like.statuses';
import { PostUserLikeStatus } from '../domain/post.like.entity';
import { UsersQueryRepo } from '../../users/infrastructure/typeorm/users.query.repo';
import { BlogsQueryRepo } from '../../blogs/infrastructure/typeorm/blogs.query.repo';
import { PostsRepo } from '../infrastructure/typeorm/posts.repo';
import { PostsLikeInfoRepo } from '../infrastructure/typeorm/posts.like.info.repo';

@Injectable()
export class PostsService {
  constructor(
    private readonly postsRepo: PostsRepo,
    private readonly blogsQueryRepo: BlogsQueryRepo,
    private readonly usersQueryRepo: UsersQueryRepo,
    private readonly postsLikeInfoRepo: PostsLikeInfoRepo,
  ) {}
  async updatePost(
    blogId: string,
    postId: string,
    input: PostInputBlogDto,
  ): Promise<boolean> {
    return this.postsRepo.updatePost(blogId, postId, input);
  }

  async deletePost(postId: string): Promise<boolean> {
    return this.postsRepo.deletePost(postId);
  }

  async createPost(
    blogId: string,
    input: PostInputBlogDto,
  ): Promise<PostOutputDto | null> {
    const blog = await this.blogsQueryRepo.findBlogById(blogId);
    const post = Post.create(input, blog!.id, blog!.name);

    const insertedPost = await this.postsRepo.createPost(post);

    return insertedPost
      ? {
          id: insertedPost.id,
          title: insertedPost.title,
          shortDescription: insertedPost.shortDescription,
          content: insertedPost.content,
          blogId: insertedPost.blogId,
          blogName: insertedPost.blogName,
          createdAt: insertedPost.createdAt,
          extendedLikesInfo: {
            likesCount: 0,
            dislikesCount: 0,
            myStatus: 'None',
            newestLikes: [],
          },
        }
      : null;
  }

  async updateLikeStatus(
    postId: string,
    userId: string,
    inputLikeStatus: LikeStatus,
  ): Promise<boolean> {
    const postLikesInfo = await this.postsLikeInfoRepo.findPostUserLikesInfo(
      postId,
      userId,
    );
    const user = await this.usersQueryRepo.findUserById(userId);
    if (!postLikesInfo) {
      const newPostLikeInfo = new PostUserLikeStatus();
      newPostLikeInfo.postId = postId;
      newPostLikeInfo.userId = userId;
      newPostLikeInfo.userLogin = user!.login;
      newPostLikeInfo.status = inputLikeStatus;
      const insertedLikeInfo =
        await this.postsLikeInfoRepo.createNewLikeInfoAndCount(
          newPostLikeInfo,
          postId,
          inputLikeStatus,
        );
      return insertedLikeInfo;
    }
    const updateLikeInfo =
      await this.postsLikeInfoRepo.updatePostUserLikeStatus(
        postId,
        userId,
        inputLikeStatus,
      );
    const updateLikesCount =
      await this.postsLikeInfoRepo.updateExistPostLikesCount(
        postId,
        postLikesInfo.status as LikeStatus,
        inputLikeStatus,
      );
    return updateLikeInfo && updateLikesCount;
  }
}
