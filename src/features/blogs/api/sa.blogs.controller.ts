import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BlogInputDto, BlogInputQueryDto } from './dto/input/blog.input.dto';
import {
  sortNPagingBlogQuery,
  sortNPagingPostQuery,
} from '../../../infrastructure/utils/query.mappers';
import { BlogsQueryRepository } from '../infrastructure/blogs.query.repository';
import { BasicAuthGuard } from '../../../infrastructure/guards/basic.auth.guard';
import { BlogsService } from '../application/blogs.service';
import { isUUID } from 'class-validator';
import {
  PostInputBlogDto,
  PostInputQueryDto,
} from '../../posts/api/dto/input/post.input.dto';
import { PostsService } from '../../posts/application/posts.service';
import { PostsQueryRepository } from '../../posts/infrastructure/posts.query.repository';

@Controller('sa/blogs')
@UseGuards(BasicAuthGuard)
export class SaBlogsController {
  constructor(
    private readonly blogsQueryRepository: BlogsQueryRepository,
    private readonly blogsService: BlogsService,
    private readonly postsService: PostsService,
    private readonly postsQueryRepository: PostsQueryRepository,
  ) {}

  @Get()
  @HttpCode(200)
  async findBlogs(@Query() inputQuery: BlogInputQueryDto) {
    const query = sortNPagingBlogQuery(inputQuery);
    const blogs = await this.blogsQueryRepository.findBlogs(query);
    return blogs;
  }

  @Post()
  @HttpCode(201)
  async createBlog(@Body() blogInputDto: BlogInputDto) {
    const newBlog = await this.blogsService.createBlog(blogInputDto);
    return newBlog;
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
    const isBlogExist = await this.blogsQueryRepository.findBlogById(blogId);
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
    const isBlogExist = await this.blogsQueryRepository.findBlogById(blogId);
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
    //@Request() req,
    @Query() inputQuery: PostInputQueryDto,
    @Param('blogId') blogId: string,
  ) {
    if (!isUUID(blogId)) {
      throw new NotFoundException();
    }
    const isBlogExist = await this.blogsQueryRepository.findBlogById(blogId);
    if (!isBlogExist) {
      throw new NotFoundException();
    }
    const query = sortNPagingPostQuery(inputQuery);
    const foundPosts =
      await this.postsQueryRepository.findPostsByBlogIdInParams(
        query,
        blogId,
        //req.userId,
      );
    if (!foundPosts) {
      throw new NotFoundException();
    }
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
    const isBlogExist = await this.blogsQueryRepository.findBlogById(blogId);
    const isPostExist = await this.postsQueryRepository.findPostById(postId);
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
    const isBlogExist = await this.blogsQueryRepository.findBlogById(blogId);
    const isPostExist = await this.postsQueryRepository.findPostById(postId);
    if (!isBlogExist || !isPostExist) {
      throw new NotFoundException();
    }
    const isDelete = await this.postsService.deletePost(blogId, postId);
    if (!isDelete) {
      throw new NotFoundException();
    }
  }
}
