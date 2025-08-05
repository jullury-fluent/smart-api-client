import { z, ZodTypeWithQueryable, Order } from '@jullury-fluent/smart-api-common';
import { QueryBuilderSDK } from '../../src/query-builder/query-builder-sdk';

const userSchema = z.object({
  id: z.number().queryable().sortable(),
  name: z.string().queryable().sortable(),
  email: z.string().queryable().email(),
  status: z.enum(['active', 'inactive']).queryable(),
  createdAt: z.date().queryable(),
  company: z.object({
    id: z.number(),
    name: z.string().queryable(),
  }),
});

const createMockSchema = (): ZodTypeWithQueryable<any> => {
  return userSchema;
};

type MockSchema = typeof userSchema;

describe('QueryBuilderSDK', () => {
  let queryBuilder: QueryBuilderSDK<MockSchema>;
  let mockSchema: MockSchema;

  beforeEach(() => {
    mockSchema = createMockSchema();
    queryBuilder = new QueryBuilderSDK(mockSchema);
  });

  describe('initialization', () => {
    it('should initialize with default values', () => {
      const result = queryBuilder.build();

      expect(result).toEqual({
        page: 1,
        limit: 10,
        offset: 0,
        total: 0,
        search: '',
      });
    });
  });

  describe('pagination methods', () => {
    it('should set page correctly', () => {
      queryBuilder.setPage(3);
      const result = queryBuilder.build();

      expect(result.page).toBe(3);
      expect(result.offset).toBe(20); // (3-1) * 10 = 20
    });

    it('should set page size correctly', () => {
      queryBuilder.setPageSize(25);
      const result = queryBuilder.build();

      expect(result.limit).toBe(25);
    });

    it('should navigate to next page', () => {
      queryBuilder.setPage(2);
      queryBuilder.nextPage();
      const result = queryBuilder.build();

      expect(result.page).toBe(3);
      expect(result.offset).toBe(20); // (3-1) * 10 = 20
    });

    it('should navigate to previous page', () => {
      queryBuilder.setPage(3);
      queryBuilder.prevPage();
      const result = queryBuilder.build();

      expect(result.page).toBe(2);
      expect(result.offset).toBe(10); // (2-1) * 10 = 10
    });

    it('should not go below page 1 when navigating to previous page', () => {
      queryBuilder.setPage(1);
      queryBuilder.prevPage();
      const result = queryBuilder.build();

      expect(result.page).toBe(1);
      expect(result.offset).toBe(0);
    });

    it('should set total correctly', () => {
      queryBuilder.setTotal(100);
      const result = queryBuilder.build();

      expect(result.total).toBe(100);
    });

    it('should return true if there is a next page', () => {
      queryBuilder.setPage(1);
      queryBuilder.setTotal(20);

      expect(queryBuilder.hasNextPage()).toBe(true);
    });

    it('should return false if there is no next page', () => {
      queryBuilder.setPage(2);
      queryBuilder.setTotal(20);

      expect(queryBuilder.hasNextPage()).toBe(false);
    });

    it('should return true if there is a previous page', () => {
      queryBuilder.setPage(2);

      expect(queryBuilder.hasPrevPage()).toBe(true);
    });

    it('should return false if there is no previous page', () => {
      queryBuilder.setPage(1);

      expect(queryBuilder.hasPrevPage()).toBe(false);
    });
  });

  describe('search methods', () => {
    it('should set search term correctly', () => {
      queryBuilder.setSearch('test query');
      const result = queryBuilder.build();

      expect(result.search).toBe('test query');
    });

    it('should get search term correctly', () => {
      queryBuilder.setSearch('test query');
      const search = queryBuilder.getSearch();

      expect(search).toBe('test query');
    });
  });

  describe('reset method', () => {
    it('should reset all values to defaults', () => {
      // Set non-default values
      queryBuilder.setPage(3).setPageSize(25);
      queryBuilder.setTotal(100);
      queryBuilder.setSearch('test query');

      // Reset
      queryBuilder.reset();

      // Check defaults
      const result = queryBuilder.build();
      expect(result).toEqual({
        page: 1,
        limit: 10,
        offset: 0,
        total: 0,
        search: '',
      });
    });

    it('should return the instance for chaining', () => {
      const result = queryBuilder.reset();
      expect(result).toBe(queryBuilder);
    });
  });

  describe('build method', () => {
    it('should return an object with all query properties', () => {
      queryBuilder.setPage(2).setPageSize(15);
      queryBuilder.setTotal(75);
      queryBuilder.setSearch('test query');

      const result = queryBuilder.build();

      expect(result).toEqual({
        page: 2,
        limit: 15,
        offset: 15,
        total: 75,
        search: 'test query',
      });
    });
  });

  describe('buildUrlParams method', () => {
    it('should build URL parameters correctly', () => {
      queryBuilder.setPage(3).setPageSize(20);
      // No sort yet
      let params = queryBuilder.buildUrlParams();
      expect(params.get('page')).toBe('3');
      expect(params.get('limit')).toBe('20');
      expect(params.get('order_by')).toBeNull();
      expect(params.get('order_type')).toBeNull();

      // Add sort
      queryBuilder.addSort('id', Order.ASC);
      params = queryBuilder.buildUrlParams();
      expect(params.get('order_by')).toBe('id');
      expect(params.get('order_type')).toBe('ASC');
    });

    it('should update URL parameters when query changes', () => {
      queryBuilder.setPage(2).setPageSize(15);
      let params = queryBuilder.buildUrlParams();
      expect(params.get('page')).toBe('2');
      expect(params.get('limit')).toBe('15');
      expect(params.get('order_by')).toBeNull();
      expect(params.get('order_type')).toBeNull();

      queryBuilder.addSort('name', Order.DESC);
      queryBuilder.setPage(4).setPageSize(25);
      params = queryBuilder.buildUrlParams();
      expect(params.get('page')).toBe('4');
      expect(params.get('limit')).toBe('25');
      expect(params.get('order_by')).toBe('name');
      expect(params.get('order_type')).toBe('DESC');
      expect(params.toString()).toContain('page=4');
      expect(params.toString()).toContain('limit=25');
      expect(params.toString()).toContain('order_by=name');
      expect(params.toString()).toContain('order_type=DESC');
      expect(queryBuilder.buildUrlParamsString()).toBe(
        'page=4&limit=25&order_by=name&order_type=DESC'
      );
    });
  });

  describe('method chaining', () => {
    it('should support chaining multiple methods', () => {
      queryBuilder.setPage(2).setPageSize(20);
      queryBuilder.setTotal(100);
      queryBuilder.setSearch('test query').nextPage().addSort('name', Order.DESC).prevPage();
      const result = queryBuilder.build();

      expect(result).toEqual({
        page: 2,
        limit: 20,
        offset: 20,
        total: 100,
        search: 'test query',
        order_by: 'name',
        order_type: 'DESC',
      });
    });
  });
});
