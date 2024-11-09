import { Controller, Delete, HttpCode } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Controller('testing/all-data')
export class DeleteAllController {
  constructor(@InjectDataSource() private dataSource: DataSource) {}
  @Delete()
  @HttpCode(204)
  async deleteAll() {
    await this.dataSource.query(`
      TRUNCATE 
        public.user,
        public.device,
        public."refresh_token_black_list",
        public."user_email_confirmation",
        public."user_password_recovery",
        public."blog",
        public."post",
        public."post_likes_count_info",
        public."post_user_like_status"
         CASCADE
      `);
  }
}
