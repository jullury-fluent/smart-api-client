'use client';
import { useCallback } from 'react';
import { ZodTypeWithQueryable } from '@jullury-fluent/smart-api-common';
import usePagination from './use-pagination';
import useSearch from './use-search';
import useSort from './use-sort';
import useFilter from './use-filter';

interface UseParamsOptions {
  initialPage?: number;
  initialLimit?: number;
  initialSearch?: string;
  initialFilters?: Record<string, any>;
}

export function useParams<T extends ZodTypeWithQueryable<any>>(
  schema: T,
  options?: UseParamsOptions
) {
  const pagination = usePagination({
    initialPage: options?.initialPage,
    initialLimit: options?.initialLimit,
  });

  const search = useSearch({
    initialSearch: options?.initialSearch,
  });

  const sort = useSort<T>(schema);

  const filter = useFilter<T>(schema, {
    initialFilters: options?.initialFilters,
  });

  const reset = useCallback(() => {
    pagination.reset();
    search.reset();
    sort.reset();
    filter.reset();
  }, [pagination, search, sort, filter]);

  const build = useCallback(() => {
    return {
      ...pagination.getPagination(),
      ...sort.getSort(),
      search: search.getSearch(),
      where: filter.getFilters(),
    };
  }, [pagination, sort, search, filter]);

  const buildUrlParams = useCallback(() => {
    const params = new URLSearchParams();

    const paginationData = pagination.getPagination();
    params.set('page', paginationData.page.toString());
    params.set('limit', paginationData.limit.toString());

    const sortData = sort.getSort();
    if (sortData) {
      if (sortData.order_by) {
        params.set('order_by', sortData.order_by);
      }
      if (sortData.order_type) {
        params.set('order_type', sortData.order_type);
      }
    }

    const searchValue = search.getSearch();
    if (searchValue) {
      params.set('search', searchValue);
    }

    const filterData = filter.getFilters();
    if (Object.keys(filterData).length > 0) {
      params.set('filter', JSON.stringify(filterData));
    }

    return params;
  }, [pagination.getPagination(), sort.getSort(), search.getSearch(), filter.getFilters()]);

  const buildUrlParamsString = useCallback(() => {
    return buildUrlParams().toString();
  }, [buildUrlParams]);

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

export default useParams;
