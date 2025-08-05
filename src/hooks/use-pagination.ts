'use client';
import { useState, useCallback } from 'react';

interface PaginationState {
  page: number;
  limit: number;
  offset: number;
  total: number;
}

interface UsePaginationOptions {
  initialPage?: number;
  initialLimit?: number;
}

export function usePagination(options?: UsePaginationOptions) {
  const [state, setState] = useState<PaginationState>({
    page: options?.initialPage || 1,
    limit: options?.initialLimit || 10,
    offset: ((options?.initialPage || 1) - 1) * (options?.initialLimit || 10),
    total: 0,
  });

  const setPagination = useCallback((page: number, limit: number) => {
    setState(prev => ({
      ...prev,
      page,
      limit,
      offset: (page - 1) * limit,
    }));
  }, []);

  const setPage = useCallback((page: number) => {
    setState(prev => ({
      ...prev,
      page,
      offset: (page - 1) * prev.limit,
    }));
  }, []);

  const setPageSize = useCallback((limit: number) => {
    setState(prev => ({
      ...prev,
      limit,
      offset: (prev.page - 1) * limit,
    }));
  }, []);

  const nextPage = useCallback(() => {
    setState(prev => ({
      ...prev,
      page: prev.page + 1,
      offset: prev.page * prev.limit,
    }));
  }, []);

  const prevPage = useCallback(() => {
    setState(prev => {
      if (prev.page > 1) {
        return {
          ...prev,
          page: prev.page - 1,
          offset: (prev.page - 2) * prev.limit,
        };
      }
      return prev;
    });
  }, []);

  const setTotal = useCallback((total: number) => {
    setState(prev => ({
      ...prev,
      total,
    }));
  }, []);

  const hasNextPage = useCallback(() => {
    return state.offset + state.limit < state.total;
  }, [state.offset, state.limit, state.total]);

  const hasPrevPage = useCallback(() => {
    return state.page > 1;
  }, [state.page]);

  const reset = useCallback(() => {
    setState({
      page: 1,
      limit: 10,
      offset: 0,
      total: 0,
    });
  }, []);

  const getPagination = useCallback(() => {
    return {
      page: state.page,
      limit: state.limit,
      offset: state.offset,
      total: state.total,
    };
  }, [state]);

  return {
    setPagination,
    setPage,
    setPageSize,
    nextPage,
    prevPage,
    setTotal,
    hasNextPage,
    hasPrevPage,
    reset,
    getPagination,
  };
}

export default usePagination;
