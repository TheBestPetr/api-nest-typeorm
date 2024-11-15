import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Comment, CommentatorInfo } from '../../domain/comment.entity';
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
      order: { [query.sortBy]: query.sortDirection },
      take: query.pageSize,
      skip: (query.pageNumber - 1) * query.pageSize,
    });
    const commentIdsArr = items.map((comment) => comment.id);
    const commentatorInfo = await this.commentatorInfoRepo.find({
      where: { commentId: In(commentIdsArr) },
    });
    const commentatorInfoMap = commentatorInfo.reduce((acc, info) => {
      acc[info.commentId] = {
        userId: info.userId,
        userLogin: info.userLogin,
      };
      return acc;
    }, {});
    const likesCountInfo = await this.commentLikesCountRepo.find({
      where: { commentId: In(commentIdsArr) },
    });
    const likesCountMap = likesCountInfo.reduce((acc, info) => {
      acc[info.commentId] = {
        likesCount: info.likesCount,
        dislikesCount: info.dislikesCount,
      };
      return acc;
    }, {});
    const likeStatuses = userId
      ? await this.commentUserLikeStatusRepo.find({
          where: { commentId: In(commentIdsArr), userId: userId },
        })
      : [];
    const userLikesStatusMap = likeStatuses.reduce((acc, like) => {
      acc[like.commentId] = like.status;
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
        commentatorInfo: commentatorInfoMap[comment.id],
        createdAt: comment.createdAt,
        likesInfo: {
          likesCount: likesCountMap[comment.id].likesCount,
          dislikesCount: likesCountMap[comment.id].dislikesCount,
          myStatus: userLikesStatusMap[comment.id] || 'None',
        },
      })),
    };
  }

  async findCommentById(
    commentId: string,
    userId?: string,
  ): Promise<CommentOutputDto | null> {
    const comment = await this.commentsRepo.findOneBy({ id: commentId });
    if (!comment) {
      return null;
    }
    const commentatorInfo = await this.commentatorInfoRepo.findOneBy({
      commentId: comment.id,
    });
    const commentLikesInfo = await this.commentLikesCountRepo.findOneBy({
      commentId: comment.id,
    });
    let status = 'None';
    if (userId) {
      const likeStatus = await this.commentUserLikeStatusRepo.findOneBy([
        { commentId: commentId },
        { userId: userId },
      ]);
      status = likeStatus?.status ?? 'None';
    }

    return {
      id: comment.id,
      content: comment.content,
      commentatorInfo: {
        userId: commentatorInfo!.userId,
        userLogin: commentatorInfo!.userLogin,
      },
      createdAt: comment.createdAt,
      likesInfo: {
        likesCount: commentLikesInfo!.likesCount,
        dislikesCount: commentLikesInfo!.dislikesCount,
        myStatus: status as LikeStatus,
      },
    };
  }
}
