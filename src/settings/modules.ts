import { Module } from '@nestjs/common';
import { RefreshTokenBlackList } from '../features/auth/domain/refresh.token.entity';
import { Blog } from '../features/blogs/domain/blog.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '../features/posts/domain/post.entity';
import {
  PostLikesCountInfo,
  PostUserLikeStatus,
} from '../features/posts/domain/post.like.entity';
import { Device } from '../features/securityDevices/domain/device.entity';
import {
  User,
  UserEmailConfirmation,
  UserPasswordRecovery,
} from '../features/users/domain/user.entity';
import { AuthController } from '../features/auth/api/auth.controller';
import { BlogsController } from '../features/blogs/api/blogs.controller';
import { SaBlogsController } from '../features/blogs/api/sa.blogs.controller';
import { PostsController } from '../features/posts/api/posts.controller';
import { DevicesController } from '../features/securityDevices/api/devices.controller';
import { UsersController } from '../features/users/api/users.controller';
import { AuthService } from '../features/auth/application/auth.service';
import { BcryptService } from '../infrastructure/utils/services/bcrypt.service';
import { NodemailerService } from '../infrastructure/utils/services/nodemailer.service';
import { JwtService } from '../infrastructure/utils/services/jwt.service';
import { RefreshTokenBlackListRepo } from '../features/auth/infrastructure/typeorm/refresh.token.repo';
import { BlogsQueryRepo } from '../features/blogs/infrastructure/typeorm/blogs.query.repo';
import { BlogsRepo } from '../features/blogs/infrastructure/typeorm/blogs.repo';
import { BlogsService } from '../features/blogs/application/blogs.service';
import { PostsService } from '../features/posts/application/posts.service';
import { PostsRepo } from '../features/posts/infrastructure/typeorm/posts.repo';
import { PostsQueryRepo } from '../features/posts/infrastructure/typeorm/posts.query.repo';
import { DevicesService } from '../features/securityDevices/application/devices.service';
import { DevicesRepo } from '../features/securityDevices/infrastructure/typeorm/devices.repo';
import { UsersQueryRepo } from '../features/users/infrastructure/typeorm/users.query.repo';
import { UsersRepo } from '../features/users/infrastructure/typeorm/users.repo';
import { UsersService } from '../features/users/application/users.service';
import {
  emailConfirmationCodeIsExist,
  emailIsExist,
  emailResendingIsEmailConfirmed,
  loginIsExist,
  passwordRecoveryCodeIsExist,
} from '../infrastructure/decorators/auth.custom.decorator';
import { PostsLikeInfoRepo } from '../features/posts/infrastructure/typeorm/posts.like.info.repo';
import { Comment } from '../features/comments/domain/comment.entity';
import {
  CommentLikesCountInfo,
  CommentUserLikeStatus,
} from '../features/comments/domain/comment.like.entity';
import { CommentsService } from '../features/comments/application/comments.service';
import { CommentsRepo } from '../features/comments/infrastructure/typeorm/comments.repo';
import { CommentsQueryRepo } from '../features/comments/infrastructure/typeorm/comments.query.repo';
import { CommentsController } from '../features/comments/api/comments.controller';
import { CommentsLikeInfoRepo } from '../features/comments/infrastructure/typeorm/comments.like.info.repo';
import { CommentatorInfo } from '../features/comments/domain/commentator.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RefreshTokenBlackList,
      Blog,
      Comment,
      CommentatorInfo,
      CommentLikesCountInfo,
      CommentUserLikeStatus,
      Post,
      PostUserLikeStatus,
      PostLikesCountInfo,
      Device,
      User,
      UserEmailConfirmation,
      UserPasswordRecovery,
    ]),
  ],
  controllers: [
    AuthController,
    BlogsController,
    SaBlogsController,
    CommentsController,
    PostsController,
    DevicesController,
    UsersController,
  ],
  providers: [
    loginIsExist,
    emailIsExist,
    passwordRecoveryCodeIsExist,
    emailConfirmationCodeIsExist,
    emailResendingIsEmailConfirmed,
    AuthService,
    BcryptService,
    NodemailerService,
    JwtService,
    RefreshTokenBlackListRepo,
    BlogsService,
    BlogsRepo,
    BlogsQueryRepo,
    CommentsService,
    CommentsRepo,
    CommentsQueryRepo,
    CommentsLikeInfoRepo,
    PostsService,
    PostsRepo,
    PostsQueryRepo,
    PostsLikeInfoRepo,
    DevicesService,
    DevicesRepo,
    UsersService,
    UsersQueryRepo,
    UsersRepo,
  ],
})
export class AllModules {}
