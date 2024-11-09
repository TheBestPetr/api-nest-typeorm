import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog } from '../../domain/blog.entity';
import { Repository } from 'typeorm';
import { BlogOutputDto } from '../../api/dto/output/blog.output.dto';
import { BlogInputDto } from '../../api/dto/input/blog.input.dto';

@Injectable()
export class BlogsRepo {
  constructor(
    @InjectRepository(Blog) private readonly blogsRepo: Repository<Blog>,
  ) {}

  async createBlog(blog: Blog): Promise<BlogOutputDto | null> {
    const insertedBlog = await this.blogsRepo.save(blog);
    return insertedBlog ?? null;
  }

  async updateBlog(blogId: string, input: BlogInputDto): Promise<boolean> {
    const blog = await this.blogsRepo.findOneBy({ id: blogId });
    if (blog) {
      blog.name = input.name;
      blog.description = input.description;
      blog.websiteUrl = input.websiteUrl;
      await this.blogsRepo.save(blog);
    }
    return !!blog;
  }

  async deleteBlog(blogId: string): Promise<boolean> {
    const isBlogDeleted = await this.blogsRepo.delete({ id: blogId });
    return isBlogDeleted.affected === 1;
  }
}
