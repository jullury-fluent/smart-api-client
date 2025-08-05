'use client';
import { useState, useCallback, useMemo } from 'react';
import {
  ZodTypeWithQueryable,
  getFilterable,
  nestedToDotObject,
} from '@jullury-fluent/smart-api-common';
import { ARRAY_OPERATORS } from 'src/constants';

type FilterObject = Record<string, any>;

interface UseFilterOptions {
  initialFilters?: FilterObject;
}

export function useFilter<T extends ZodTypeWithQueryable<any>>(
  schema: T,
  options?: UseFilterOptions
) {
  const [filters, setFilters] = useState<FilterObject>(options?.initialFilters || {});

  const filterable = useMemo(() => {
    return nestedToDotObject(getFilterable(schema as any));
  }, [schema]);

  const isKeyPathFilterable = useCallback(
    (keyPath: string): boolean => {
      return filterable[keyPath] === true;
    },
    [filterable]
  );

  const add = useCallback(
    (field: string | string[], operator: string, value: any) => {
      const fieldPath = Array.isArray(field) ? field.join('.') : field;

      if (isKeyPathFilterable(fieldPath)) {
        setFilters(prev => {
          const newFilters = { ...prev };
          if (!newFilters[fieldPath]) {
            newFilters[fieldPath] = {};
          }
          newFilters[fieldPath][operator] = value;
          return newFilters;
        });
      } else {
        throw new Error(`Invalid filter key: ${fieldPath}`);
      }
    },
    [isKeyPathFilterable]
  );

  const update = useCallback(
    (field: string | string[], operator: string, value: any) => {
      const fieldPath = Array.isArray(field) ? field.join('.') : field;

      if (isKeyPathFilterable(fieldPath)) {
        setFilters(prev => {
          const newFilters = { ...prev };
          if (!newFilters[fieldPath]) {
            newFilters[fieldPath] = {};
          }
          newFilters[fieldPath][operator] = value;
          return newFilters;
        });
      } else {
        throw new Error(`Invalid filter key: ${fieldPath}`);
      }
    },
    [isKeyPathFilterable]
  );

  const remove = useCallback((field: string | string[], operator?: string) => {
    const fieldPath = Array.isArray(field) ? field.join('.') : field;

    setFilters(prev => {
      const newFilters = { ...prev };

      if (operator && newFilters[fieldPath]) {
        const operatorFilters = { ...newFilters[fieldPath] };
        delete operatorFilters[operator];

        if (Object.keys(operatorFilters).length === 0) {
          delete newFilters[fieldPath];
        } else {
          newFilters[fieldPath] = operatorFilters;
        }
      } else {
        delete newFilters[fieldPath];
      }

      return newFilters;
    });
  }, []);

  const applyFilters = useCallback(
    (
      input: {
        field: string;
        operator: string;
        value: string;
      }[],
      reset = true
    ) => {
      setFilters({
        ...(reset ? {} : filters),
        ...input.reduce((acc, { field, operator, value }) => {
          acc[field] = {
            [operator]: ARRAY_OPERATORS.includes(operator)
              ? value.split(',').map(v => v.trim())
              : value,
          };
          return acc;
        }, {} as FilterObject),
      });
    },
    [filters]
  );

  const reset = useCallback(() => {
    setFilters({});
  }, []);

  const getFilters = useCallback(() => {
    return filters;
  }, [filters]);

  const getFilterableObject = useCallback(() => {
    return getFilterable(schema as any);
  }, [schema]);

  return {
    add,
    update,
    remove,
    reset,
    getFilters,
    applyFilters,
    getFilterableObject,
  };
}

export default useFilter;
