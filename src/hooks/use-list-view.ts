'use client';
import { ZodTypeWithQueryable } from '@jullury-fluent/smart-api-common';
import { useDynamicQueryBuilder } from './use-dynamic-query-builder';

interface UseListViewOptions {
  pageSize?: number;
  initialPage?: number;
  initialSearch?: string;
  initialFilters?: Record<string, any>;
}

/**
 * A hook for list views that provides pagination, sorting, filtering, and search capabilities
 * @param schema The Zod schema with queryable fields
 * @param options Configuration options
 */
export function useListView<T extends ZodTypeWithQueryable<any>>(
  schema: T,
  options?: UseListViewOptions
) {
  return useDynamicQueryBuilder(schema, options);
}

export default useListView;
