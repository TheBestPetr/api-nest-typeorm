import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Comment, CommentatorInfo } from '../../domain/comment.entity';
import { CommentInputDto } from '../../api/dto/input/comment.input.dto';

@Injectable()
export class CommentsRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async createComment(
    inputComment: Comment,
    inputCommentatorInfo: CommentatorInfo,
  ) {
    const insertedComment = await this.dataSource.query(
      `INSERT INTO public.comments(
            "postId", content)
            VALUES ($1, $2)
            RETURNING *`,
      [inputComment.postId, inputComment.content],
    );

    await this.dataSource.query(
      `INSERT INTO public."commentsCommentatorInfo"(
            "commentId", "userId", "userLogin")
            VALUES ('${insertedComment[0].id}', $1, $2);`,
      [inputCommentatorInfo.userId, inputCommentatorInfo.userLogin],
    );

    await this.dataSource.query(
      `INSERT INTO public."commentsLikesCountInfo"(
            "commentId", "likesCount", "dislikesCount")
            VALUES ('${insertedComment[0].id}', 0, 0);`,
    );
    return insertedComment[0];
  }

  async updateComment(
    input: CommentInputDto,
    commentId: string,
  ): Promise<boolean> {
    return this.dataSource.query(`
      UPDATE public.comments
        SET content = '${input.content}'
        WHERE "id" = '${commentId}'`);
  }

  async deleteComment(commentId: string): Promise<boolean> {
    const isLikesCountDeleted = await this.dataSource.query(
      `
      DELETE FROM public."commentsLikesCountInfo"
        WHERE "commentId" = $1`,
      [commentId],
    );
    const isLikesInfoDeleted = await this.dataSource.query(
      `
      DELETE FROM public."commentsUserLikeInfo"
        WHERE "commentId" = $1`,
      [commentId],
    );
    const isCommentatorInfoDeleted = await this.dataSource.query(
      `
      DELETE FROM public."commentsCommentatorInfo"
        WHERE "commentId" = $1`,
      [commentId],
    );
    const isCommentDeleted = await this.dataSource.query(
      `
      DELETE FROM public.comments
        WHERE "id" = $1`,
      [commentId],
    );
    return (
      isLikesCountDeleted[1] === 1 ||
      isLikesInfoDeleted[1] === 1 ||
      isCommentatorInfoDeleted[1] === 1 ||
      isCommentDeleted[1] === 1
    );
  }
}
