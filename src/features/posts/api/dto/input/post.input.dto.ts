import {
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  Validate,
} from 'class-validator';
import { LikeStatus } from '../../../../../base/types/like.statuses';
import { Transform, TransformFnParams } from 'class-transformer';
import { blogIdIsExist } from '../../../../../infrastructure/decorators/blogId.custom.decorator';
import { Post } from '../../../domain/post.entity';

export class PostInputDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(1, 30)
  title: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(1, 100)
  shortDescription: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(1, 1000)
  content: string;

  @IsString()
  @IsNotEmpty()
  @Validate(blogIdIsExist)
  blogId: string;
}

export class PostInputLikeStatusDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^(None|Like|Dislike)$/)
  likeStatus: LikeStatus;
}

export class PostInputQueryDto {
  pageNumber: number;
  pageSize: number;
  sortBy: keyof Post;
  sortDirection: 'ASC' | 'DESC';
}

export class PostInputBlogDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(1, 30)
  title: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(1, 100)
  shortDescription: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(1, 1000)
  content: string;
}
