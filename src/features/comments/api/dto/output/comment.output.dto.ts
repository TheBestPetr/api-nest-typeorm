import { LikeStatus } from '../../../../../base/types/like.statuses';

export class CommentatorInfo {
  userId: string;
  userLogin: string;
}

export class LikesForCommentInfo {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatus;
}

export class CommentOutputDto {
  id: string;
  content: string;
  commentatorInfo: CommentatorInfo;
  createdAt: string;
  likesInfo: LikesForCommentInfo;
}

export class CommentOutputQueryDto {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: Array<CommentOutputDto>;
}
