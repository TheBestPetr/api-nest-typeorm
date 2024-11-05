import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Blog } from '../../domain/blog.entity';
import { BlogInputDto } from '../../api/dto/input/blog.input.dto';

@Injectable()
export class BlogsRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async createBlog(input: Blog) {
    const insertedBlog = await this.dataSource.query(`
        INSERT INTO public.blogs(
            "name",
            "description", 
            "websiteUrl",  
            "isMembership")
            VALUES (
                '${input.name}', 
                '${input.description}', 
                '${input.websiteUrl}', 
                '${input.isMembership}')
                RETURNING *`);
    return insertedBlog;
    /*const createdBlogId = await this.dataSource.query(
      `
      SELECT id
      FROM public.blogs
      WHERE "name" = $1 AND "websiteUrl" = $2`,
      [input.name, input.websiteUrl],
    );
    return createdBlogId[0];*/
  }

  async updateBlog(blogId: string, input: BlogInputDto) {
    return this.dataSource.query(`
        UPDATE public.blogs
            SET 
                "name" = '${input.name}', 
                "description" = '${input.description}', 
                "websiteUrl" = '${input.websiteUrl}'
            WHERE "id" = '${blogId}';`);
  }

  async deleteBlog(blogId: string): Promise<boolean> {
    const isPostDeleted = await this.dataSource.query(`
        DELETE FROM public.posts
            WHERE "blogId" = '${blogId}'
    `);
    const isBlogDeleted = await this.dataSource.query(`
        DELETE FROM public.blogs
            WHERE "id" = '${blogId}'
    `);
    return isPostDeleted[1] === 1 || isBlogDeleted[1] === 1;
  }
}
