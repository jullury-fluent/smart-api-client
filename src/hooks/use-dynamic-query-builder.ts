'use client';
import { Order, ZodTypeWithQueryable } from '@jullury-fluent/smart-api-common';
import useParams from './use-params';

interface UseDynamicQueryBuilderOptions {
  pageSize?: number;
  initialPage?: number;
  initialSearch?: string;
  initialFilters?: Record<string, any>;
}

export function useDynamicQueryBuilder<T extends ZodTypeWithQueryable<any>>(
  schema: T,
  options?: UseDynamicQueryBuilderOptions
) {
  const { pagination, search, sort, filter, reset, build, buildUrlParams, buildUrlParamsString } =
    useParams<T>(schema, {
      initialPage: options?.initialPage || 1,
      initialLimit: options?.pageSize || 10,
      initialSearch: options?.initialSearch || '',
      initialFilters: options?.initialFilters || {},
    });

  return {
    pagination,
    search,
    sort,
    filter,
    reset,
    build,
    buildUrlParams,
    buildUrlParamsString,
  };
}

export default useDynamicQueryBuilder;
