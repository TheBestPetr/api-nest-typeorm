import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class UserInputDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(3, 10)
  login: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(6, 20)
  password: string;

  @IsString()
  @IsNotEmpty()
  @Matches('[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')
  email: string;
}

export class UserInputQueryDto {
  sortBy: string;
  sortDirection: 1 | -1 | 'asc' | 'desc' | 'ascending' | 'descending';
  pageNumber: number;
  pageSize: number;
  searchLoginTerm: string | null;
  searchEmailTerm: string | null;
}
