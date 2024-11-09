import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../../domain/post.entity';
import { Repository } from 'typeorm';
import { PostInputBlogDto } from '../../api/dto/input/post.input.dto';
import { PostLikesCountInfo } from '../../domain/post.like.entity';

@Injectable()
export class PostsRepo {
  constructor(
    @InjectRepository(Post) private readonly postsRepo: Repository<Post>,
    @InjectRepository(PostLikesCountInfo)
    private readonly postsLikesCountRepo: Repository<PostLikesCountInfo>,
  ) {}

  async createPost(post: Post): Promise<Post | null> {
    const insertedPost = await this.postsRepo.save(post);
    await this.postsLikesCountRepo.save({ postId: insertedPost.id });
    return insertedPost ?? null;
  }

  async updatePost(
    blogId: string,
    postId: string,
    input: PostInputBlogDto,
  ): Promise<boolean> {
    const post = await this.postsRepo.findOneBy([
      { blogId: blogId },
      { id: postId },
    ]);
    if (post) {
      post.title = input.title;
      post.shortDescription = input.shortDescription;
      post.content = input.content;
      await this.postsRepo.save(post);
    }
    return !!post;
  }

  async deletePost(blogId: string, postId: string): Promise<boolean> {
    const isPostDeleted = await this.postsRepo.delete({ id: postId });
    return isPostDeleted.affected === 1;
  }
}
