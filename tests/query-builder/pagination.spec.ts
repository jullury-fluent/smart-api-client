import { PaginationQuery } from '../../src/query-builder/pagination';

describe('PaginationQuery', () => {
  let paginationQuery: PaginationQuery;

  beforeEach(() => {
    paginationQuery = new PaginationQuery();
  });

  describe('initialization', () => {
    it('should initialize with default values', () => {
      const pagination = paginationQuery.getPagination();
      expect(pagination.page).toBe(1);
      expect(pagination.limit).toBe(10);
      expect(pagination.offset).toBe(0);
      expect(pagination.total).toBe(0);
    });
  });

  describe('setPagination', () => {
    it('should set page and limit and calculate offset correctly', () => {
      paginationQuery.setPagination(3, 25);
      const pagination = paginationQuery.getPagination();
      
      expect(pagination.page).toBe(3);
      expect(pagination.limit).toBe(25);
      expect(pagination.offset).toBe(50); // (3-1) * 25 = 50
    });

    it('should return the instance for chaining', () => {
      const result = paginationQuery.setPagination(2, 15);
      expect(result).toBe(paginationQuery);
    });
  });

  describe('setPage', () => {
    it('should set page and recalculate offset', () => {
      // First set a custom limit to verify offset calculation
      paginationQuery.setPageSize(20);
      
      // Then set the page
      paginationQuery.setPage(4);
      
      const pagination = paginationQuery.getPagination();
      expect(pagination.page).toBe(4);
      expect(pagination.offset).toBe(60); // (4-1) * 20 = 60
    });

    it('should return the instance for chaining', () => {
      const result = paginationQuery.setPage(5);
      expect(result).toBe(paginationQuery);
    });
  });

  describe('setPageSize', () => {
    it('should set limit correctly', () => {
      paginationQuery.setPageSize(30);
      const pagination = paginationQuery.getPagination();
      
      expect(pagination.limit).toBe(30);
    });

    it('should recalculate offset when limit changes', () => {
      // Set initial values
      paginationQuery.setPagination(3, 10);
      const initialPage = paginationQuery.getPagination().page;
      
      // Change only the page size
      paginationQuery.setPageSize(15);
      
      // Offset should be recalculated based on new limit
      const expectedOffset = (initialPage - 1) * 15;
      expect(paginationQuery.getPagination().offset).toBe(expectedOffset);
    });

    it('should return the instance for chaining', () => {
      const result = paginationQuery.setPageSize(25);
      expect(result).toBe(paginationQuery);
    });
  });

  describe('nextPage', () => {
    it('should increment page by 1', () => {
      const initialPage = paginationQuery.getPagination().page;
      
      paginationQuery.nextPage();
      
      expect(paginationQuery.getPagination().page).toBe(initialPage + 1);
    });

    it('should recalculate offset correctly', () => {
      paginationQuery.setPageSize(15);
      paginationQuery.setPage(2); // offset = 15
      
      paginationQuery.nextPage(); // should be page 3, offset = 30
      
      expect(paginationQuery.getPagination().offset).toBe(30);
    });

    it('should return the instance for chaining', () => {
      const result = paginationQuery.nextPage();
      expect(result).toBe(paginationQuery);
    });
  });

  describe('prevPage', () => {
    it('should decrement page by 1 when page > 1', () => {
      paginationQuery.setPage(5);
      
      paginationQuery.prevPage();
      
      expect(paginationQuery.getPagination().page).toBe(4);
    });

    it('should not decrement page when page is already 1', () => {
      paginationQuery.setPage(1);
      
      paginationQuery.prevPage();
      
      expect(paginationQuery.getPagination().page).toBe(1);
    });

    it('should recalculate offset correctly', () => {
      paginationQuery.setPageSize(20);
      paginationQuery.setPage(4); // offset = 60
      
      paginationQuery.prevPage(); // should be page 3, offset = 40
      
      expect(paginationQuery.getPagination().offset).toBe(40);
    });

    it('should return the instance for chaining', () => {
      paginationQuery.setPage(3); // Ensure we're not at page 1
      const result = paginationQuery.prevPage();
      expect(result).toBe(paginationQuery);
    });
  });

  describe('setTotal', () => {
    it('should set total correctly', () => {
      paginationQuery.setTotal(100);
      
      expect(paginationQuery.getPagination().total).toBe(100);
    });

    it('should return the instance for chaining', () => {
      const result = paginationQuery.setTotal(250);
      expect(result).toBe(paginationQuery);
    });
  });

  describe('reset', () => {
    it('should reset all values to defaults', () => {
      // Set non-default values
      paginationQuery.setPagination(5, 25);
      paginationQuery.setTotal(100);
      
      // Reset
      paginationQuery.reset();
      
      // Check defaults
      const pagination = paginationQuery.getPagination();
      expect(pagination.page).toBe(1);
      expect(pagination.limit).toBe(10);
      expect(pagination.offset).toBe(0);
      expect(pagination.total).toBe(0);
    });

    it('should return the instance for chaining', () => {
      const result = paginationQuery.reset();
      expect(result).toBe(paginationQuery);
    });
  });

  describe('getPagination', () => {
    it('should return an object with all pagination properties', () => {
      paginationQuery.setPagination(3, 15);
      paginationQuery.setTotal(75);
      
      const pagination = paginationQuery.getPagination();
      
      expect(pagination).toEqual({
        page: 3,
        limit: 15,
        offset: 30,
        total: 75
      });
    });

    it('should return a new object each time', () => {
      const pagination1 = paginationQuery.getPagination();
      const pagination2 = paginationQuery.getPagination();
      
      expect(pagination1).not.toBe(pagination2);
      expect(pagination1).toEqual(pagination2);
    });
  });

  describe('hasNextPage', () => {
    it('should return true if there is a next page', () => {
      paginationQuery.setPagination(1, 10);
      paginationQuery.setTotal(20);
      
      expect(paginationQuery.hasNextPage()).toBe(true);
    });

    it('should return false if there is no next page', () => {
      paginationQuery.setPagination(2, 10);
      paginationQuery.setTotal(20);
      
      expect(paginationQuery.hasNextPage()).toBe(false);
    });
  });

  describe('hasPrevPage', () => {
    it('should return true if there is a previous page', () => {
      paginationQuery.setPagination(2, 10);
      
      expect(paginationQuery.hasPrevPage()).toBe(true);
    });

    it('should return false if there is no previous page', () => {
      paginationQuery.setPagination(1, 10);
      
      expect(paginationQuery.hasPrevPage()).toBe(false);
    });
  });

  describe('method chaining', () => {
    it('should support chaining multiple methods', () => {
      const result = paginationQuery
        .setPagination(2, 20)
        .setTotal(100)
        .nextPage()
        .getPagination();
      
      expect(result).toEqual({
        page: 3,
        limit: 20,
        offset: 40,
        total: 100
      });
    });
  });
});
