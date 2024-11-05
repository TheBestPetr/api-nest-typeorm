import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
  Param,
  Put,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from '../application/comments.service';
import { CommentsQueryRepository } from '../infrastructure/sql/comments.query.repository';
import { BearerAuthWithout401 } from '../../../infrastructure/decorators/bearer.auth.without.401';
import { isUUID } from 'class-validator';
import { BearerAuthGuard } from '../../../infrastructure/guards/bearer.auth.guard';
import {
  CommentInputDto,
  CommentInputLikeStatusDto,
} from './dto/input/comment.input.dto';

@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly commentsQueryRepository: CommentsQueryRepository,
  ) {}

  @UseGuards(BearerAuthWithout401)
  @Get(':commentId')
  @HttpCode(200)
  async findCommentById(@Param('commentId') commentId: string, @Request() req) {
    if (!isUUID(commentId)) {
      throw new NotFoundException();
    }
    const comment = await this.commentsQueryRepository.findCommentById(
      commentId,
      req.userId,
    );
    if (!comment) {
      throw new NotFoundException();
    }
    return comment;
  }

  @UseGuards(BearerAuthGuard)
  @Put(':commentId')
  @HttpCode(204)
  async updateComment(
    @Request() req,
    @Param('commentId') commentId: string,
    @Body() commentInputDto: CommentInputDto,
  ) {
    if (!isUUID(commentId)) {
      throw new NotFoundException();
    }
    const isCommentExist =
      await this.commentsQueryRepository.findCommentById(commentId);
    if (!isCommentExist) {
      throw new NotFoundException();
    }
    const isUserCanDoThis = await this.commentsService.isUserCanDoThis(
      req.userId,
      commentId,
    );
    if (!isUserCanDoThis) {
      throw new ForbiddenException();
    }
    const updatedComment = await this.commentsService.updateComment(
      commentInputDto,
      commentId,
    );
    if (!updatedComment) {
      throw new NotAcceptableException();
    }
  }

  @UseGuards(BearerAuthGuard)
  @Delete(':commentId')
  @HttpCode(204)
  async deleteController(
    @Request() req,
    @Param('commentId') commentId: string,
  ) {
    if (!req.userId) {
      throw new UnauthorizedException();
    }
    if (!isUUID(commentId)) {
      throw new NotFoundException();
    }
    const comment =
      await this.commentsQueryRepository.findCommentById(commentId);
    if (!comment) {
      throw new NotFoundException();
    }
    const isUserCanDoThis = await this.commentsService.isUserCanDoThis(
      req.userId,
      commentId,
    );
    if (!isUserCanDoThis) {
      throw new ForbiddenException();
    }
    const isDelete = await this.commentsService.delete(commentId);
    if (!isDelete) {
      throw new NotFoundException();
    }
  }

  @UseGuards(BearerAuthGuard)
  @Put(':commentId/like-status')
  @HttpCode(204)
  async updateCommentLikeStatus(
    @Request() req,
    @Param('commentId') commentId: string,
    @Body() inputLikeStatus: CommentInputLikeStatusDto,
  ) {
    if (!req.userId) {
      throw new UnauthorizedException();
    }
    if (!isUUID(commentId)) {
      throw new NotFoundException();
    }
    const comment =
      await this.commentsQueryRepository.findCommentById(commentId);
    if (!comment) {
      throw new NotFoundException();
    }
    const isUpdate = await this.commentsService.updateLikeStatus(
      commentId,
      req.userId,
      inputLikeStatus.likeStatus,
    );
    if (!isUpdate) {
      throw new InternalServerErrorException();
    }
  }
}
