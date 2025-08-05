export class PaginationQuery {
  private offset: number = 0;
  private page: number = 1;
  private limit: number = 10;
  private total: number = 0;

  setPagination = (page: number, limit: number) => {
    this.page = page;
    this.limit = limit;
    this.offset = (page - 1) * limit;
    return this;
  };

  setPage = (page: number) => {
    this.page = page;
    this.offset = (page - 1) * this.limit;
    return this;
  };

  setPageSize = (limit: number) => {
    this.limit = limit;
    this.offset = (this.page - 1) * this.limit;
    return this;
  };

  nextPage = () => {
    this.page += 1;
    this.offset = (this.page - 1) * this.limit;
    return this;
  };

  prevPage = () => {
    if (this.page > 1) {
      this.page -= 1;
      this.offset = (this.page - 1) * this.limit;
      return this;
    }
    return this;
  };

  setTotal = (total: number) => {
    this.total = total;
    return this;
  };

  hasNextPage = () => {
    return this.offset + this.limit < this.total;
  };

  hasPrevPage = () => {
    return this.page > 1;
  };

  reset = () => {
    this.page = 1;
    this.limit = 10;
    this.offset = 0;
    this.total = 0;
    return this;
  };

  getPagination = () => ({
    page: this.page,
    limit: this.limit,
    offset: this.offset,
    total: this.total,
  });
}
