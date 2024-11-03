import { LikeStatus } from '../../../../../base/types/like.statuses';

export class LikeForPostDetailsType {
  addedAt: string;
  userId: string;
  login: string;
}

export class ExtendedLikesForPostInfo {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatus;
  newestLikes: LikeForPostDetailsType[] | [];
}

export class PostOutputDto {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: ExtendedLikesForPostInfo;
}

export class PostOutputQueryDto {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: Array<PostOutputDto>;
}
