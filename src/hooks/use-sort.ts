'use client';
import { useState, useCallback, useMemo } from 'react';
import {
  Order,
  ZodTypeWithQueryable,
  getSortable,
  nestedToDotObject,
} from '@jullury-fluent/smart-api-common';

interface SortState {
  order_by: string | null;
  order_type: Order | null;
}

export function useSort<T extends ZodTypeWithQueryable<any>>(schema: T) {
  const [sort, setSort] = useState<SortState>({
    order_by: null,
    order_type: null,
  });

  const sortable = useMemo(() => {
    return nestedToDotObject(getSortable(schema as any));
  }, [schema]);

  const isKeyPathSortable = useCallback(
    (keyPath: string): boolean => {
      return sortable[keyPath] === true;
    },
    [sortable]
  );

  const addSort = useCallback(
    (key: string, order: Order = Order.ASC) => {
      if (isKeyPathSortable(key)) {
        setSort({
          order_by: key,
          order_type: order,
        });
      } else {
        throw new Error(`Invalid sort key: ${key}`);
      }
    },
    [isKeyPathSortable]
  );

  const updateSort = useCallback(
    (key: string, order: Order) => {
      if (!sort.order_by || sort.order_by !== key) {
        throw new Error(`Sort key not found or does not match current sort: ${key}`);
      }

      if (isKeyPathSortable(key)) {
        setSort(prev => ({
          ...prev,
          order_type: order,
        }));
      } else {
        throw new Error(`Invalid sort key: ${key}`);
      }
    },
    [sort.order_by, isKeyPathSortable]
  );

  const removeSort = useCallback(
    (key: string) => {
      if (sort.order_by === key) {
        setSort({
          order_by: null,
          order_type: null,
        });
      } else {
        throw new Error(`Sort key not found: ${key}`);
      }
    },
    [sort.order_by]
  );

  const reset = useCallback(() => {
    setSort({
      order_by: null,
      order_type: null,
    });
  }, []);

  const getSort = useCallback(() => {
    if (!sort.order_by || !sort.order_type) {
      return null;
    }

    return {
      order_by: sort.order_by,
      order_type: sort.order_type,
    };
  }, [sort.order_by, sort.order_type]);

  return {
    addSort,
    updateSort,
    removeSort,
    reset,
    getSort,
  };
}

export default useSort;
