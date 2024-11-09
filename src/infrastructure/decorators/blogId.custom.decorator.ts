import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { BlogsQueryRepo } from '../../features/blogs/infrastructure/typeorm/blogs.query.repo';

@ValidatorConstraint({ name: 'blogIdIsExist', async: true })
@Injectable()
export class blogIdIsExist implements ValidatorConstraintInterface {
  constructor(private readonly blogsQueryRepo: BlogsQueryRepo) {}

  async validate(blogId: string) {
    const blog = await this.blogsQueryRepo.findBlogById(blogId);
    if (!blog) {
      return false;
    }
    return true;
  }
  defaultMessage(): string {
    return "blog with such id doesn't exist";
  }
}
