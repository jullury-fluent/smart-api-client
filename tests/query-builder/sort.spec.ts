import { z, ZodTypeWithQueryable } from '@jullury-fluent/smart-api-common';
import { SortQuery } from '../../src/query-builder/sort';
import { Order } from '@jullury-fluent/smart-api-common';

const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  status: z.enum(['active', 'inactive']),
  createdAt: z.date(),
  company: z.object({
    id: z.number(),
    name: z.string(),
  }),
});

type UserSchema = typeof userSchema;

const userSchemaWithQueryables: ZodTypeWithQueryable<UserSchema> = z.object({
  id: z.number().sortable().queryable(),
  name: z.string().sortable().queryable(),
  email: z.string().sortable().queryable().email(),
  status: z.enum(['active', 'inactive']).queryable().sortable(),
  createdAt: z.date().queryable().sortable(),
  company: z.object({
    id: z.number().queryable().sortable(),
    name: z.string().queryable().sortable(),
  }),
});

type UserSchemaWithQueryablesType = typeof userSchemaWithQueryables;

describe('SortQuery', () => {
  let mockSchema: ZodTypeWithQueryable<UserSchemaWithQueryablesType> = userSchemaWithQueryables;
  let sortQuery: SortQuery<UserSchemaWithQueryablesType> = new SortQuery(mockSchema);

  beforeEach(() => {
    mockSchema = userSchemaWithQueryables;
    //console.log('mockSchema', mockSchema);
    sortQuery = new SortQuery(mockSchema);
  });

  describe('initialization', () => {
    it('should initialize with null sort', () => {
      expect(sortQuery.getSort()).toBeNull();
    });
  });

  describe('addSort', () => {
    it('should add sort for valid sortable key', () => {
      sortQuery.addSort('id', Order.ASC);
      expect(sortQuery.getSort()).toEqual({
        order_by: 'id',
        order_type: Order.ASC,
      });
    });

    it('should add sort for valid nested sortable key', () => {
      sortQuery.addSort('company.id', Order.DESC);
      expect(sortQuery.getSort()).toEqual({
        order_by: 'company.id',
        order_type: Order.DESC,
      });
    });

    it('should throw error for non-sortable key', () => {
      expect(() => {
        sortQuery.addSort('email', Order.ASC);
      }).toThrow('Invalid sort key: email');
    });

    it('should throw error for invalid nested key path', () => {
      expect(() => {
        sortQuery.addSort('company.nonexistent', Order.ASC);
      }).toThrow('Invalid sort key: company.nonexistent');
    });

    it('should replace existing sort when adding a new one', () => {
      sortQuery.addSort('id', Order.ASC);
      sortQuery.addSort('name', Order.DESC);

      expect(sortQuery.getSort()).toEqual({
        order_by: 'name',
        order_type: Order.DESC,
      });
    });
  });

  describe('updateSort', () => {
    it('should update order type for existing sort key', () => {
      sortQuery.addSort('id', Order.ASC);
      sortQuery.updateSort('id', Order.DESC);

      expect(sortQuery.getSort()).toEqual({
        order_by: 'id',
        order_type: 'DESC',
      });
    });

    it('should throw error when updating non-existing sort key', () => {
      expect(() => {
        sortQuery.updateSort('id', Order.DESC);
      }).toThrow('Sort key not found or does not match current sort: id');
    });

    it('should throw error when updating with different key than current sort', () => {
      sortQuery.addSort('id', Order.ASC);

      expect(() => {
        sortQuery.updateSort('name', Order.DESC);
      }).toThrow('Sort key not found or does not match current sort: name');
    });

    it('should throw error when updating with non-sortable key', () => {
      sortQuery.addSort('id', Order.ASC);

      const sortable = (sortQuery as any).sortable;
      delete sortable.id;

      expect(() => {
        sortQuery.updateSort('id', Order.DESC);
      }).toThrow('Invalid sort key: id');
    });
  });

  describe('removeSort', () => {
    it('should remove existing sort', () => {
      sortQuery.addSort('id', Order.ASC);
      sortQuery.removeSort('id');

      expect(sortQuery.getSort()).toBeNull();
    });

    it('should throw error when removing non-existing sort key', () => {
      expect(() => {
        sortQuery.removeSort('id');
      }).toThrow('Sort key not found: id');
    });

    it('should throw error when removing different key than current sort', () => {
      sortQuery.addSort('id', Order.ASC);

      expect(() => {
        sortQuery.removeSort('name');
      }).toThrow('Sort key not found: name');
    });
  });

  describe('reset', () => {
    it('should reset sort to null', () => {
      sortQuery.addSort('id', Order.ASC);
      sortQuery.reset();

      expect(sortQuery.getSort()).toBeNull();
    });

    it('should have no effect when sort is already null', () => {
      expect(sortQuery.getSort()).toBeNull();
      sortQuery.reset();
      expect(sortQuery.getSort()).toBeNull();
    });
  });

  describe('build', () => {
    it('should return the current sort configuration', () => {
      sortQuery.addSort('id', Order.ASC);

      expect(sortQuery.getSort()).toEqual({
        order_by: 'id',
        order_type: 'ASC',
      });
    });

    it('should return null when no sort is set', () => {
      expect(sortQuery.getSort()).toBeNull();
    });
  });

  describe('nested sort paths', () => {
    it('should handle deeply nested sort paths', () => {
      sortQuery.addSort('company.name', Order.ASC);

      expect(sortQuery.getSort()).toEqual({
        order_by: 'company.name',
        order_type: 'ASC',
      });
    });

    it('should validate each segment of a nested path', () => {
      expect(() => {
        sortQuery.addSort('company.invalid.field', Order.ASC);
      }).toThrow('Invalid sort key: company.invalid.field');
    });
  });
});
