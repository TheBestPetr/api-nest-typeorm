import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog } from '../../domain/blog.entity';
import { ILike, Repository } from 'typeorm';
import {
  BlogOutputDto,
  BlogOutputQueryDto,
} from '../../api/dto/output/blog.output.dto';
import { BlogInputQueryDto } from '../../api/dto/input/blog.input.dto';

@Injectable()
export class BlogsQueryRepo {
  constructor(
    @InjectRepository(Blog) private readonly blogsQueryRepo: Repository<Blog>,
  ) {}

  async findBlogs(query: BlogInputQueryDto): Promise<BlogOutputQueryDto> {
    const search = query.searchNameTerm ?? '';
    const [items, count] = await this.blogsQueryRepo.findAndCount({
      where: { name: ILike(`%${search}%`) },
      order: { [query.sortBy]: query.sortDirection },
      take: query.pageSize,
      skip: (query.pageNumber - 1) * query.pageSize,
    });

    return {
      pagesCount: Math.ceil(count / query.pageSize),
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: count,
      items: items.map((blog) => ({
        id: blog.id,
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        isMembership: blog.isMembership,
      })),
    };
  }

  async findBlogById(blogId: string): Promise<BlogOutputDto | null> {
    const blog = await this.blogsQueryRepo.findOneBy({ id: blogId });

    return blog
      ? {
          id: blog.id,
          name: blog.name,
          description: blog.description,
          websiteUrl: blog.websiteUrl,
          createdAt: blog.createdAt,
          isMembership: blog.isMembership,
        }
      : null;
  }
}
