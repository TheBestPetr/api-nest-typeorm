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
        public."device",
        public."refresh_token"
         CASCADE
      `);
  }
}
