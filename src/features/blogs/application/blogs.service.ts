import { Injectable } from '@nestjs/common';
import { BlogInputDto } from '../api/dto/input/blog.input.dto';
import { BlogOutputDto } from '../api/dto/output/blog.output.dto';
import { Blog } from '../domain/blog.entity';
import { BlogsRepo } from '../infrastructure/typeorm/blogs.repo';

@Injectable()
export class BlogsService {
  constructor(private readonly blogsRepo: BlogsRepo) {}
  async createBlog(input: BlogInputDto): Promise<BlogOutputDto | null> {
    const blog = new Blog();
    blog.name = input.name;
    blog.description = input.description;
    blog.websiteUrl = input.websiteUrl;
    blog.isMembership = false;
    blog.createdAt = new Date().toISOString();
    const insertedBlog = await this.blogsRepo.createBlog(blog);
    return insertedBlog
      ? {
          id: insertedBlog.id,
          name: insertedBlog.name,
          description: insertedBlog.description,
          websiteUrl: insertedBlog.websiteUrl,
          createdAt: insertedBlog.createdAt,
          isMembership: insertedBlog.isMembership,
        }
      : null;
  }

  async updateBlog(blogId: string, input: BlogInputDto): Promise<boolean> {
    return this.blogsRepo.updateBlog(blogId, input);
  }

  async deleteBlog(blogId: string): Promise<boolean> {
    return this.blogsRepo.deleteBlog(blogId);
  }
}
