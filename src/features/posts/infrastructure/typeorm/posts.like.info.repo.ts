import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  PostLikesCountInfo,
  PostUserLikeStatus,
} from '../../domain/post.like.entity';
import { Repository } from 'typeorm';
import { LikeStatus } from '../../../../base/types/like.statuses';

@Injectable()
export class PostsLikeInfoRepo {
  constructor(
    @InjectRepository(PostUserLikeStatus)
    private readonly postUserLikeStatusRepo: Repository<PostUserLikeStatus>,
    @InjectRepository(PostLikesCountInfo)
    private readonly postLikesCountRepo: Repository<PostLikesCountInfo>,
  ) {}

  async findPostUserLikesInfo(
    postId: string,
    userId: string,
  ): Promise<PostUserLikeStatus | null> {
    const likeInfo = await this.postUserLikeStatusRepo.findOneBy({
      userId: userId,
      postId: postId,
    });
    return likeInfo ?? null;
  }

  async createNewLikeInfoAndCount(
    postLikeInfo: PostUserLikeStatus,
    postId: string,
    likeStatus: LikeStatus,
  ): Promise<boolean> {
    const newLikeStatus =
      await this.postUserLikeStatusRepo.insert(postLikeInfo);
    const postLikesCountInfo = await this.postLikesCountRepo.findOneBy({
      postId: postId,
    });
    if (!postLikesCountInfo) {
      return false;
    }
    switch (likeStatus) {
      case 'Like':
        postLikesCountInfo.likesCount++;
        await this.postLikesCountRepo.save(postLikesCountInfo);
        return true;

      case 'Dislike':
        postLikesCountInfo.dislikesCount++;
        await this.postLikesCountRepo.save(postLikesCountInfo);
        return true;
    }
    return !!newLikeStatus || !!postLikesCountInfo;
  }

  async updatePostUserLikeStatus(
    postId: string,
    userId: string,
    newStatus: LikeStatus,
  ): Promise<boolean> {
    const postUserLikeStatus = await this.postUserLikeStatusRepo.findOneBy({
      postId: postId,
      userId: userId,
    });
    if (!postUserLikeStatus) {
      return false;
    }
    postUserLikeStatus.status = newStatus;
    await this.postUserLikeStatusRepo.save(postUserLikeStatus);
    return true;
  }

  async updateExistPostLikesCount(
    postId: string,
    oldStatus: LikeStatus,
    newStatus: LikeStatus,
  ): Promise<boolean> {
    const postLikesCountInfo = await this.postLikesCountRepo.findOneBy({
      postId: postId,
    });
    if (!postLikesCountInfo) {
      return false;
    }
    if (oldStatus === 'Like' && newStatus === 'Dislike') {
      postLikesCountInfo.likesCount--;
      postLikesCountInfo.dislikesCount++;
      await this.postLikesCountRepo.save(postLikesCountInfo);
      return true;
    }
    if (oldStatus === 'Like' && newStatus === 'None') {
      postLikesCountInfo.likesCount--;
      await this.postLikesCountRepo.save(postLikesCountInfo);
      return true;
    }
    if (oldStatus === 'Dislike' && newStatus === 'Like') {
      postLikesCountInfo.dislikesCount--;
      postLikesCountInfo.likesCount++;
      await this.postLikesCountRepo.save(postLikesCountInfo);
      return true;
    }
    if (oldStatus === 'Dislike' && newStatus === 'None') {
      postLikesCountInfo.dislikesCount--;
      await this.postLikesCountRepo.save(postLikesCountInfo);
      return true;
    }
    if (oldStatus === 'None' && newStatus === 'Like') {
      postLikesCountInfo.likesCount++;
      await this.postLikesCountRepo.save(postLikesCountInfo);
      return true;
    }
    if (oldStatus === 'None' && newStatus === 'Dislike') {
      postLikesCountInfo.dislikesCount++;
      await this.postLikesCountRepo.save(postLikesCountInfo);
      return true;
    }
    return oldStatus === newStatus;
  }
}
