import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { BlogsQueryRepository } from '../../features/blogs/infrastructure/sql/blogs.query.repository';

@ValidatorConstraint({ name: 'blogIdIsExist', async: true })
@Injectable()
export class blogIdIsExist implements ValidatorConstraintInterface {
  constructor(private readonly blogsQueryRepository: BlogsQueryRepository) {}

  async validate(blogId: string) {
    const blog = await this.blogsQueryRepository.findBlogById(blogId);
    if (!blog) {
      return false;
    }
    return true;
  }
  defaultMessage(): string {
    return "blog with such id doesn't exist";
  }
}
