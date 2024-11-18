import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Comment } from '../../domain/comment.entity';
import {
  CommentLikesCountInfo,
  CommentUserLikeStatus,
} from '../../domain/comment.like.entity';
import {
  CommentOutputDto,
  CommentOutputQueryDto,
} from '../../api/dto/output/comment.output.dto';
import { LikeStatus } from '../../../../base/types/like.statuses';
import { CommentInputQueryDto } from '../../api/dto/input/comment.input.dto';
import { CommentatorInfo } from '../../domain/commentator.entity';

@Injectable()
export class CommentsQueryRepo {
  constructor(
    @InjectRepository(Comment)
    private readonly commentsRepo: Repository<Comment>,
    @InjectRepository(CommentatorInfo)
    private readonly commentatorInfoRepo: Repository<CommentatorInfo>,
    @InjectRepository(CommentLikesCountInfo)
    private readonly commentLikesCountRepo: Repository<CommentLikesCountInfo>,
    @InjectRepository(CommentUserLikeStatus)
    private readonly commentUserLikeStatusRepo: Repository<CommentUserLikeStatus>,
  ) {}

  async findCommentsForPost(
    postId: string,
    query: CommentInputQueryDto,
    userId?: string,
  ): Promise<CommentOutputQueryDto> {
    const [items, count] = await this.commentsRepo.findAndCount({
      where: { postId: postId },
      relations: { commentator: true, likesCountInfo: true },
      order: { [query.sortBy]: query.sortDirection },
      take: query.pageSize,
      skip: (query.pageNumber - 1) * query.pageSize,
    });

    const commentIds = items.map((comment) => comment.id);

    const status = await this.commentUserLikeStatusRepo.findBy({
      userId: userId,
      commentId: In(commentIds),
    });

    const statusMap = status.reduce((acc, status) => {
      acc[status.commentId] = status.status;
      return acc;
    }, {});

    return {
      pagesCount: Math.ceil(count / query.pageSize),
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: count,
      items: items.map((comment) => ({
        id: comment.id,
        content: comment.content,
        commentatorInfo: {
          userId: comment.commentator.userId,
          userLogin: comment.commentator.userLogin,
        },
        createdAt: comment.createdAt,
        likesInfo: {
          likesCount: comment.likesCountInfo.likesCount,
          dislikesCount: comment.likesCountInfo.dislikesCount,
          myStatus: statusMap[comment.id] || 'None',
        },
      })),
    };
  }

  async findCommentById(
    commentId: string,
    userId?: string,
  ): Promise<CommentOutputDto | null> {
    const comment = await this.commentsRepo.findOne({
      where: { id: commentId },
      relations: { commentator: true, likesCountInfo: true },
    });

    let status = 'None';
    if (userId) {
      const likeStatus = await this.commentUserLikeStatusRepo.findOneBy({
        commentId: commentId,
        userId: userId,
      });
      status = likeStatus?.status ?? 'None';
    }

    return comment
      ? {
          id: comment.id,
          content: comment.content,
          commentatorInfo: {
            userId: comment.commentator.userId,
            userLogin: comment.commentator.userLogin,
          },
          createdAt: comment.createdAt,
          likesInfo: {
            likesCount: comment.likesCountInfo.likesCount,
            dislikesCount: comment.likesCountInfo.dislikesCount,
            myStatus: status as LikeStatus,
          },
        }
      : null;
  }
}
