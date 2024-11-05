import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { BlogInputQueryDto } from '../../api/dto/input/blog.input.dto';
import {
  BlogOutputDto,
  BlogOutputQueryDto,
} from '../../api/dto/output/blog.output.dto';

@Injectable()
export class BlogsQueryRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}
  async findBlogs(query: BlogInputQueryDto): Promise<BlogOutputQueryDto> {
    const search = query.searchNameTerm ? `%${query.searchNameTerm}%` : '%';
    const items = await this.dataSource.query(
      `
        SELECT id, name, description, "websiteUrl", "createdAt", "isMembership"
        FROM public.blogs
        WHERE "name" ILIKE $1
        ORDER BY "${query.sortBy}" ${query.sortDirection}, "id" ASC
        LIMIT $2 OFFSET $3
    `,
      [search, query.pageSize, (query.pageNumber - 1) * query.pageSize],
    );
    const totalCountResult = await this.dataSource.query(
      `SELECT COUNT(*) FROM public.blogs
        WHERE "name" ILIKE $1`,
      [search],
    );
    const totalCount = parseInt(totalCountResult[0].count, 10);
    return {
      pagesCount: Math.ceil(totalCount / query.pageSize),
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: totalCount as number,
      items: items.map((blog) => ({
        id: blog.id,
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        isMembership: blog.isMembership,
        createdAt: blog.createdAt,
      })),
    };
  }

  async findBlogById(blogId: string): Promise<BlogOutputDto | null> {
    const blog = await this.dataSource.query(`
        SELECT id, name, description, "websiteUrl", "createdAt", "isMembership"
        FROM public.blogs
        WHERE "id" = '${blogId}';`);
    if (blog.length > 0) {
      return {
        id: blog[0].id,
        name: blog[0].name,
        description: blog[0].description,
        websiteUrl: blog[0].websiteUrl,
        createdAt: blog[0].createdAt,
        isMembership: blog[0].isMembership,
      };
    }
    return null;
  }
}
