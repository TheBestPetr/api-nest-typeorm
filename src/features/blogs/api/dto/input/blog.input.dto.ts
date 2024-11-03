import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class BlogInputDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(1, 15)
  name: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(1, 500)
  description: string;

  @IsString()
  @IsNotEmpty()
  @Length(10, 100)
  @Matches('https://([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(/[a-zA-Z0-9_-]+)*/?$')
  websiteUrl: string;
}

export class BlogInputQueryDto {
  searchNameTerm: string | null;
  sortBy: string;
  sortDirection: 1 | -1 | 'asc' | 'desc' | 'ascending' | 'descending';
  pageNumber: number;
  pageSize: number;
}
