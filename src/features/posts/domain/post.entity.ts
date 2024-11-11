import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Blog } from '../../blogs/domain/blog.entity';
import { PostUserLikeStatus } from './post.like.entity';
import { PostInputBlogDto } from '../api/dto/input/post.input.dto';

@Entity({ name: 'posts' })
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 30 })
  title: string;

  @Column({ type: 'varchar', length: 100 })
  shortDescription: string;

  @Column({ type: 'varchar', length: 1000 })
  content: string;

  @Column({ type: 'uuid' })
  blogId: string;

  @Column({ type: 'varchar' })
  blogName: string;

  @CreateDateColumn({ type: 'timestamp with time zone', update: false })
  createdAt: string;

  static create(dto: PostInputBlogDto, blogId: string, blogName: string) {
    const post = new Post();
    post.title = dto.title;
    post.shortDescription = dto.shortDescription;
    post.content = dto.content;
    post.blogId = blogId;
    post.blogName = blogName;
    return post;
  }

  @ManyToOne(() => Blog, (blog) => blog.posts)
  blog: Blog;

  /*@OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];*/

  @OneToMany(() => PostUserLikeStatus, (user) => user.post)
  likeStatuses: PostUserLikeStatus[];
}
