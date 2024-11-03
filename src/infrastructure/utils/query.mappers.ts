import { UserInputQueryDto } from '../../features/users/api/dto/input/user.input.dto';
import { BlogInputQueryDto } from '../../features/blogs/api/dto/input/blog.input.dto';
import { PostInputQueryDto } from '../../features/posts/api/dto/input/post.input.dto';
import { CommentInputQueryDto } from '../../features/comments/api/dto/input/comment.input.dto';

export const sortNPagingBlogQuery = (query: BlogInputQueryDto) => {
  return {
    searchNameTerm: query.searchNameTerm ? query.searchNameTerm : null,
    sortBy: query.sortBy ? query.sortBy : 'createdAt',
    sortDirection: query.sortDirection ? query.sortDirection : 'desc',
    pageNumber: query.pageNumber ? +query.pageNumber : 1,
    pageSize: query.pageSize ? +query.pageSize : 10,
  };
};

export const sortNPagingPostQuery = (query: PostInputQueryDto) => {
  return {
    sortBy: query.sortBy ? query.sortBy : 'createdAt',
    sortDirection: query.sortDirection ? query.sortDirection : 'desc',
    pageNumber: query.pageNumber ? +query.pageNumber : 1,
    pageSize: query.pageSize ? +query.pageSize : 10,
  };
};

export const sortNPagingUserQuery = (
  query: Partial<UserInputQueryDto>,
): UserInputQueryDto => {
  return {
    sortBy: query.sortBy ? query.sortBy : 'createdAt',
    sortDirection: query.sortDirection ? query.sortDirection : 'desc',
    pageNumber: query.pageNumber ? +query.pageNumber : 1,
    pageSize: query.pageSize ? +query.pageSize : 10,
    searchLoginTerm: query.searchLoginTerm ? query.searchLoginTerm : null,
    searchEmailTerm: query.searchEmailTerm ? query.searchEmailTerm : null,
  };
};

export const sortNPagingCommentQuery = (
  query: Partial<CommentInputQueryDto>,
): CommentInputQueryDto => {
  return {
    pageNumber: query.pageNumber ? +query.pageNumber : 1,
    pageSize: query.pageSize ? +query.pageSize : 10,
    sortBy: query.sortBy ? query.sortBy : 'createdAt',
    sortDirection: query.sortDirection ? query.sortDirection : 'desc',
  };
};
