export class UserOutputDto {
  id: string;
  login: string;
  email: string;
  createdAt: string;
}

export class UserOutputQueryDto {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: Array<UserOutputDto>;
}
