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
        public.users,
        public.devices,
        public."refresh_token_black_list",
        public."users_email_confirmation",
        public."users_password_recovery",
        public."blogs",
        public."posts",
        public."post_likes_count_info",
        public."post_likes_status_info"
         CASCADE
      `);
  }
}
