import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotAcceptableException,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { BlogInputDto, BlogInputQueryDto } from './dto/input/blog.input.dto';
import {
  sortNPagingBlogQuery,
  sortNPagingPostQuery,
} from '../../../infrastructure/utils/query.mappers';
import { BasicAuthGuard } from '../../../infrastructure/guards/basic.auth.guard';
import { BlogsService } from '../application/blogs.service';
import { isUUID } from 'class-validator';
import {
  PostInputBlogDto,
  PostInputQueryDto,
} from '../../posts/api/dto/input/post.input.dto';
import { PostsService } from '../../posts/application/posts.service';
import { BlogsQueryRepo } from '../infrastructure/typeorm/blogs.query.repo';
import { PostsQueryRepo } from '../../posts/infrastructure/typeorm/posts.query.repo';

@Controller('sa/blogs')
@UseGuards(BasicAuthGuard)
export class SaBlogsController {
  constructor(
    private readonly blogsQueryRepo: BlogsQueryRepo,
    private readonly blogsService: BlogsService,
    private readonly postsService: PostsService,
    private readonly postsQueryRepo: PostsQueryRepo,
  ) {}

  @Get()
  @HttpCode(200)
  async findBlogs(@Query() inputQuery: BlogInputQueryDto) {
    const query = sortNPagingBlogQuery(inputQuery);
    const blogs = await this.blogsQueryRepo.findBlogs(query);
    return blogs;
  }

  @Post()
  @HttpCode(201)
  async createBlog(@Body() blogInputDto: BlogInputDto) {
    const newBlog = await this.blogsService.createBlog(blogInputDto);
    if (newBlog) {
      return newBlog;
    }
    throw new NotAcceptableException();
  }

  @Put('/:blogId')
  @HttpCode(204)
  async updateBlog(
    @Param('blogId') blogId: string,
    @Body() blogInputDto: BlogInputDto,
  ) {
    if (!isUUID(blogId)) {
      throw new NotFoundException();
    }
    const isBlogExist = await this.blogsQueryRepo.findBlogById(blogId);
    if (!isBlogExist) {
      throw new NotFoundException();
    }
    const updatedBlog = await this.blogsService.updateBlog(
      blogId,
      blogInputDto,
    );
    if (!updatedBlog) {
      throw new NotFoundException();
    }
  }

  @Delete(':blogId')
  @HttpCode(204)
  async deleteBlog(@Param('blogId') blogId: string) {
    if (!isUUID(blogId)) {
      throw new NotFoundException();
    }
    const isDelete: boolean = await this.blogsService.deleteBlog(blogId);
    if (!isDelete) {
      throw new NotFoundException();
    }
  }

  @Post(':blogId/posts')
  @HttpCode(201)
  async createPostByBlogIdInParams(
    @Param('blogId') blogId: string,
    @Body() postInputBlogDto: PostInputBlogDto,
  ) {
    if (!isUUID(blogId)) {
      throw new NotFoundException();
    }
    const isBlogExist = await this.blogsQueryRepo.findBlogById(blogId);
    if (!isBlogExist) {
      throw new NotFoundException();
    }
    const newPost = await this.postsService.createPost(
      blogId,
      postInputBlogDto,
    );
    if (!newPost) {
      throw new NotFoundException();
    }
    return newPost;
  }

  @Get(':blogId/posts')
  @HttpCode(200)
  async findPostsByBlogIdInParams(
    @Request() req,
    @Query() inputQuery: PostInputQueryDto,
    @Param('blogId') blogId: string,
  ) {
    if (!isUUID(blogId)) {
      throw new NotFoundException();
    }
    const isBlogExist = await this.blogsQueryRepo.findBlogById(blogId);
    if (!isBlogExist) {
      throw new NotFoundException();
    }
    const query = sortNPagingPostQuery(inputQuery);
    const foundPosts = await this.postsQueryRepo.findPostsByBlogIdInParams(
      query,
      blogId,
      req.userId,
    );
    return foundPosts;
  }

  @Put(':blogId/posts/:postId')
  @HttpCode(204)
  async updateBlogController(
    @Param('blogId') blogId: string,
    @Param('postId') postId: string,
    @Body() postInputBlogDto: PostInputBlogDto,
  ) {
    if (!isUUID(blogId) || !isUUID(postId)) {
      throw new NotFoundException();
    }
    const isBlogExist = await this.blogsQueryRepo.findBlogById(blogId);
    const isPostExist = await this.postsQueryRepo.findPostById(postId);
    if (!isBlogExist || !isPostExist) {
      throw new NotFoundException();
    }
    const updatedPost = await this.postsService.updatePost(
      blogId,
      postId,
      postInputBlogDto,
    );
    if (!updatedPost) {
      throw new NotFoundException();
    }
  }

  @Delete(':blogId/posts/:postId')
  @HttpCode(204)
  async deleteBlogController(
    @Param('blogId') blogId: string,
    @Param('postId') postId: string,
  ) {
    if (!isUUID(blogId) || !isUUID(postId)) {
      throw new NotFoundException();
    }
    const isBlogExist = await this.blogsQueryRepo.findBlogById(blogId);
    const isPostExist = await this.postsQueryRepo.findPostById(postId);
    if (!isBlogExist || !isPostExist) {
      throw new NotFoundException();
    }
    const isDelete = await this.postsService.deletePost(postId);
    if (!isDelete) {
      throw new NotFoundException();
    }
  }
}
