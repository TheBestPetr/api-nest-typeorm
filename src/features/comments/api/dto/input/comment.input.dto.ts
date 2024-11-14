import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { LikeStatus } from '../../../../../base/types/like.statuses';
import { Transform, TransformFnParams } from 'class-transformer';
import { Comment } from '../../../domain/comment.entity';

export class CommentInputDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(20, 300)
  content: string;
}

export class CommentInputLikeStatusDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^(None|Like|Dislike)$/)
  likeStatus: LikeStatus;
}

export class CommentInputQueryDto {
  pageNumber: number;
  pageSize: number;
  sortBy: keyof Comment;
  sortDirection: 1 | -1 | 'asc' | 'desc' | 'ascending' | 'descending';
}
