import { Order } from '@jullury-fluent/smart-api-common';
import { ZodTypeWithQueryable } from '@jullury-fluent/smart-api-common';
import { PaginationQuery } from './pagination';
import { SearchQuery } from './search';
import { SortQuery } from './sort';

export class QueryBuilderSDK<T extends ZodTypeWithQueryable<any>> {
  // private filters: Record<string, any> = {};
  private sort: SortQuery<T>;

  private pagination: PaginationQuery;
  private search: SearchQuery;
  private schema: ZodTypeWithQueryable<any>;

  constructor(schema: ZodTypeWithQueryable<any>) {
    this.schema = schema;
    this.pagination = new PaginationQuery();
    this.search = new SearchQuery();
    this.sort = new SortQuery<T>(schema);
  }

  addSort(field: string, order: Order = Order.ASC): this {
    this.sort.addSort(field, order);
    return this;
  }

  getSort() {
    return this.sort.getSort();
  }

  setPage(page: number): this {
    this.pagination.setPage(page);
    return this;
  }

  setPageSize(size: number): this {
    this.pagination.setPageSize(size);
    return this;
  }

  hasNextPage(): boolean {
    return this.pagination.hasNextPage();
  }

  hasPrevPage(): boolean {
    return this.pagination.hasPrevPage();
  }

  nextPage(): this {
    this.pagination.nextPage();
    return this;
  }

  prevPage(): this {
    this.pagination.prevPage();
    return this;
  }

  setTotal(total: number): void {
    this.pagination.setTotal(total);
  }

  getPagination() {
    return this.pagination.getPagination();
  }

  setSearch(search: string): this {
    this.search.setSearch(search);
    return this;
  }

  getSearch() {
    return this.search.getSearch();
  }

  /*
  addFilter(field: string | string[], operator: string, value: any): this {
    const fieldPath = Array.isArray(field) ? field.join('.') : field;
    if (!this.filters[fieldPath]) {
      this.filters[fieldPath] = {};
    }
    this.filters[fieldPath][operator] = value;
    return this;
  }

  updateFilter(field: string | string[], operator: string, value: any): this {
    const fieldPath = Array.isArray(field) ? field.join('.') : field;
    if (!this.filters[fieldPath]) {
      this.filters[fieldPath] = {};
    }
    this.filters[fieldPath][operator] = value;
    return this;
  }

  getFilters(): Record<string, any> {
    return this.filters;
  }


  getFilterableObject(): Record<string, unknown> {
    return getFilterable(this.schema as any);
  }

  getSortableObject(): Record<string, unknown> {
    return getSortable(this.schema as any);
  }

  validateFilterOptions(
    filter: any,
    filterMap: Record<string, unknown>,
  ): [true, null] | [null, string | z.ZodError] {
    return validateOptions(filter, filterMap);
  }

  validateQueryOptions({
    filter,
    order_by,
    order_type,
  }: {
    filter?: string;
    order_by?: string;
    order_type?: Order;
  }): {
    filter: FilterObject | null;
    order_by: string | null;
    order_type: Order | null;
  } {
    let parsedFilter: FilterObject | null = null;

    if (filter) {
      try {
        const parsed = JSON.parse(filter);
        if (isPlainObject(parsed)) {
          parsedFilter = parsed as FilterObject;
        }
      } catch (e) {
        // Invalid JSON, keep filter as null
      }
    }

    return {
      filter: parsedFilter,
      order_by: order_by || null,
      order_type: order_type || null,
    };
  } 
    */

  reset() {
    this.pagination.reset();
    this.search.reset();
    return this;
  }

  build() {
    return {
      //where: this.getFilters(),
      //order: this.getSort().map(({ field, order }) => [field, order]),
      ...this.getPagination(),
      ...this.getSort(),
      search: this.getSearch(),
    };
  }

  buildUrlParams() {
    const params = new URLSearchParams();
    /* params.set('filter', JSON.stringify(this.getFilters()));
    params.set(
      'order_by',
      this.getSort()
        .map(({ field, order }) => `${field}:${order}`)
        .join(','),
    );
    */
    params.set('page', this.pagination.getPagination().page.toString());
    params.set('limit', this.pagination.getPagination().limit.toString());
    const sorting = this.getSort();
    if (sorting) {
      if (sorting.order_by) {
        params.set('order_by', sorting.order_by);
      }
      if (sorting.order_type) {
        params.set('order_type', sorting.order_type);
      }
    }
    return params;
  }

  buildUrlParamsString() {
    return this.buildUrlParams().toString();
  }
}
