'use client';
import { useState, useCallback } from 'react';

interface UseSearchOptions {
  initialSearch?: string;
}

export function useSearch(options?: UseSearchOptions) {
  const [search, setSearchState] = useState<string>(options?.initialSearch || '');

  const setSearch = useCallback((value: string) => {
    setSearchState(value);
  }, []);

  const reset = useCallback(() => {
    setSearchState('');
  }, []);

  const getSearch = useCallback(() => {
    return search;
  }, [search]);

  return {
    setSearch,
    reset,
    getSearch,
  };
}

export default useSearch;
