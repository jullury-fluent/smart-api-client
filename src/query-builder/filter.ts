import {
  validateOperatorInput,
  getFilterable,
  ZodTypeWithQueryable,
} from '@jullury-fluent/smart-api-common';

export function filterQuery<T extends ZodTypeWithQueryable<any>>(schema: T) {
  let filters: Array<Record<string, unknown>> = [];
  const filterable = getFilterable(schema as ZodTypeWithQueryable<any>);

  const parseKeyPath = (key: string | string[]): string[] => (Array.isArray(key) ? key : [key]);

  const getPathString = (keyPath: string[]) => keyPath.join('.');

  const isKeyPathFilterable = (
    keyPath: string[],
    filterableObj: Record<string, unknown>
  ): boolean => {
    let current = filterableObj;
    for (const part of keyPath) {
      if (!(part in current)) return false;
      current = current[part] as Record<string, unknown>;
    }
    return typeof current === 'boolean' && current === true;
  };

  const buildNestedObject = (
    keyPath: string[],
    operator: string,
    value: string | number | object
  ): Record<string, unknown> => {
    const lastKey = keyPath[keyPath.length - 1];
    const nestedValue = { [lastKey]: { [operator]: value } };

    return keyPath.slice(0, -1).reduceRight((acc, key) => ({ [key]: acc }), nestedValue);
  };

  const getNestedKey = (obj: Record<string, any>, path: string): any => {
    return path.split('.').reduce((acc, part) => {
      return acc && typeof acc === 'object' ? acc[part] : undefined;
    }, obj);
  };

  type UserAttributeFilterable = 'username' | 'mail' | ['company', 'name'];

  type CompanyAttributeFilterable = 'name' | 'industry' | 'revenue';

  type Operator =
    | 'eq'
    | 'ne'
    | 'gt'
    | 'gte'
    | 'lt'
    | 'lte'
    | 'in'
    | 'notIn'
    | 'like'
    | 'notLike'
    | 'iLike'
    | 'notILike'
    | 'between'
    | 'notBetween'
    | 'is'
    | 'not'
    | 'or'
    | 'and'
    | 'startsWith'
    | 'endsWith'
    | 'substring';

  const addFilter = (
    key: UserAttributeFilterable | CompanyAttributeFilterable,
    operator: Operator,
    value: string | number | object
  ) => {
    const keyPath = parseKeyPath(key);

    if (!isKeyPathFilterable(keyPath, filterable)) {
      throw new Error(`Key path "${getPathString(keyPath)}" is not filterable`);
    }

    const [_, err] = validateOperatorInput(operator, value);
    if (err) {
      throw new Error(`Invalid operator ${operator} for value ${value}`);
    }

    const filterEntry = buildNestedObject(keyPath, operator, value);
    filters.push(filterEntry);
    return filters;
  };

  const updateFilter = (
    key: string | string[],
    operator?: string,
    value?: string | number | object
  ) => {
    const keyPath = parseKeyPath(key);

    if (!isKeyPathFilterable(keyPath, filterable)) {
      throw new Error(`Key path "${getPathString(keyPath)}" is not filterable`);
    }

    const exists = filters.some(
      filter => getNestedKey(filter, getPathString(keyPath)) !== undefined
    );
    if (!exists) {
      throw new Error(`Key path "${getPathString(keyPath)}" does not exist in current filters`);
    }

    if (!operator || value === undefined) return filters;

    const [_, err] = validateOperatorInput(operator, value);
    if (err) {
      throw new Error(`Invalid operator ${operator} for value ${value}`);
    }

    filters = filters.filter(filter => getNestedKey(filter, getPathString(keyPath)) === undefined);
    return addFilter(keyPath as UserAttributeFilterable, operator as Operator, value);
  };

  const removeFilter = (key: string | string[]) => {
    if (!isKeyPathFilterable(parseKeyPath(key), filterable)) {
      throw new Error(`Key "${key}" is not filterable`);
    }

    filters = filters.filter(filter => {
      return getNestedKey(filter, getPathString(parseKeyPath(key))) === undefined;
    });
    return filters;
  };

  const getFilters = () => filters;

  return {
    getFilters,
    addFilter,
    removeFilter,
    updateFilter,
  };
}
