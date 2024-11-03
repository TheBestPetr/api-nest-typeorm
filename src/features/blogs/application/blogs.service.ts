import { Injectable } from '@nestjs/common';
import { BlogsRepository } from '../infrastructure/blogs.repository';
import { BlogInputDto } from '../api/dto/input/blog.input.dto';
import { BlogOutputDto } from '../api/dto/output/blog.output.dto';
import { Blog } from '../domain/blog.entity';

@Injectable()
export class BlogsService {
  constructor(private readonly blogsRepository: BlogsRepository) {}
  async createBlog(input: BlogInputDto): Promise<BlogOutputDto> {
    const createdBlog = new Blog();
    createdBlog.name = input.name;
    createdBlog.description = input.description;
    createdBlog.websiteUrl = input.websiteUrl;
    createdBlog.isMembership = false;
    createdBlog.createdAt = new Date().toISOString();
    const insertedBlog = await this.blogsRepository.createBlog(createdBlog);
    return {
      id: insertedBlog[0].id,
      name: insertedBlog[0].name,
      description: insertedBlog[0].description,
      websiteUrl: insertedBlog[0].websiteUrl,
      createdAt: insertedBlog[0].createdAt,
      isMembership: insertedBlog[0].isMembership,
    };
  }

  async updateBlog(blogId: string, input: BlogInputDto): Promise<boolean> {
    return this.blogsRepository.updateBlog(blogId, input);
  }

  async deleteBlog(blogId: string): Promise<boolean> {
    return this.blogsRepository.deleteBlog(blogId);
  }
}
