import {
  Controller,
  Get,
  HttpCode,
  Request,
  NotFoundException,
  Param,
  Query,
  UseGuards,
  Body,
  Post,
  UnauthorizedException,
  Put,
  NotAcceptableException,
} from '@nestjs/common';
import { PostsService } from '../application/posts.service';
import { PostsQueryRepository } from '../infrastructure/sql/posts.query.repository';
import {
  sortNPagingCommentQuery,
  sortNPagingPostQuery,
} from '../../../infrastructure/utils/query.mappers';
import {
  PostInputLikeStatusDto,
  PostInputQueryDto,
} from './dto/input/post.input.dto';
import { isUUID } from 'class-validator';
import { BearerAuthGuard } from '../../../infrastructure/guards/bearer.auth.guard';
import {
  CommentInputDto,
  CommentInputQueryDto,
} from '../../comments/api/dto/input/comment.input.dto';
import { CommentsService } from '../../comments/application/comments.service';
import { BearerAuthWithout401 } from '../../../infrastructure/decorators/bearer.auth.without.401';
import { CommentsQueryRepository } from '../../comments/infrastructure/sql/comments.query.repository';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly postsQueryRepository: PostsQueryRepository,
    private readonly commentsService: CommentsService,
    private readonly commentsQueryRepository: CommentsQueryRepository,
  ) {}

  @UseGuards(BearerAuthWithout401)
  @Get()
  @HttpCode(200)
  async findPosts(@Request() req, @Query() inputQuery: PostInputQueryDto) {
    const query = sortNPagingPostQuery(inputQuery);
    const posts = await this.postsQueryRepository.findPosts(query, req.userId);
    return posts;
  }

  @UseGuards(BearerAuthWithout401)
  @Get(':postId')
  @HttpCode(200)
  async findPostById(@Request() req, @Param('postId') postId: string) {
    if (!isUUID(postId)) {
      throw new NotFoundException();
    }
    const foundPost = await this.postsQueryRepository.findPostById(
      postId,
      req.userId,
    );
    if (!foundPost) {
      throw new NotFoundException();
    }
    return foundPost;
  }

  @UseGuards(BearerAuthGuard)
  @Put(':postId/like-status')
  @HttpCode(204)
  async updatePostLikeStatus(
    @Request() req,
    @Param('postId') postId: string,
    @Body() inputLikeType: PostInputLikeStatusDto,
  ) {
    if (!req.userId) {
      throw new UnauthorizedException();
    }
    if (!isUUID(postId)) {
      throw new NotFoundException();
    }
    const post = await this.postsQueryRepository.findPostById(postId);
    if (!post) {
      throw new NotFoundException();
    }
    const isUpdate = await this.postsService.updateLikeStatus(
      postId,
      req.userId,
      inputLikeType.likeStatus,
    );
    if (!isUpdate) {
      throw new NotAcceptableException();
    }
  }

  @UseGuards(BearerAuthGuard)
  @Post(':postId/comments')
  @HttpCode(201)
  async createComment(
    @Request() req,
    @Param('postId') postId: string,
    @Body() commentInputDto: CommentInputDto,
  ) {
    if (!isUUID(postId)) {
      throw new NotFoundException();
    }
    const post = await this.postsQueryRepository.findPostById(postId);
    if (!post) {
      throw new NotFoundException();
    }
    const commentatorId = req.userId;
    if (!commentatorId) {
      throw new UnauthorizedException();
    }
    const comment = await this.commentsService.createComment(
      commentInputDto,
      commentatorId,
      postId,
    );
    return comment;
  }

  @UseGuards(BearerAuthWithout401)
  @Get(':postId/comments')
  @HttpCode(200)
  async findCommentsByPostIdInParams(
    @Param('postId') postId: string,
    @Query() inputQuery: CommentInputQueryDto,
    @Request() req,
  ) {
    if (!isUUID(postId)) {
      throw new NotFoundException();
    }
    const post = await this.postsQueryRepository.findPostById(postId);
    if (!post) {
      throw new NotFoundException();
    }
    const query = sortNPagingCommentQuery(inputQuery);
    const comments = await this.commentsQueryRepository.findCommentsForPost(
      postId,
      query,
      req.userId,
    );
    return comments;
  }
}
