export class SearchQuery {
  private search: string;

  constructor(search = '') {
    this.search = search;
  }

  setSearch(search: string) {
    this.search = search;
    return this;
  }

  reset() {
    this.search = '';
    return this;
  }

  getSearch() {
    return this.search;
  }
}
