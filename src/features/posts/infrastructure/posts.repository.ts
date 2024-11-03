import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Post } from '../domain/post.entity';
import { PostInputBlogDto } from '../api/dto/input/post.input.dto';

@Injectable()
export class PostsRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}
  async createPost(input: Post) {
    const insertedPost = await this.dataSource.query(`
        INSERT INTO public.posts( 
            title, 
            "shortDescription", 
            content, 
            "blogId", 
            "blogName")
            VALUES (
                '${input.title}', 
                '${input.shortDescription}', 
                '${input.content}', 
                '${input.blogId}', 
                '${input.blogName}'
            )
            RETURNING *
    `);
    return insertedPost;
  }

  async updatePost(
    blogId: string,
    postId: string,
    input: PostInputBlogDto,
  ): Promise<boolean> {
    return this.dataSource.query(`
        UPDATE public.posts
        SET title = '${input.title}', 
            "shortDescription" = '${input.shortDescription}', 
            content = '${input.content}'
        WHERE "blogId" = '${blogId}' AND "id" = '${postId}'`);
  }

  async deletePost(blogId: string, postId: string): Promise<boolean> {
    const isPostDeleted = await this.dataSource.query(`
        DELETE FROM public.posts
            WHERE "id" = '${postId}' AND "blogId" = '${blogId}'
    `);
    return isPostDeleted[1] === 1;
  }
}
