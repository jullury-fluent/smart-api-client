import { ZodTypeWithQueryable } from '@jullury-fluent/smart-api-common';

type Join<K, P> = K extends string ? (P extends string ? `${K}.${P}` : never) : never;

type ShapeOf<T> = T['_def']['shape'] extends (...args: any[]) => infer R ? R : T['_def']['shape'];

type ExtractSortableKeys<T extends ZodTypeWithQueryable<any>> = {
  [K in keyof ShapeOf<T>]: ShapeOf<T>[K] extends { isSortable: () => true }
    ? K & string
    : ShapeOf<T>[K] extends object
      ? Join<K & string, ExtractSortableKeys<ShapeOf<T>[K]>>
      : never;
}[keyof ShapeOf<T>];

export type SortableKeys<T extends ZodTypeWithQueryable<any>> = ExtractSortableKeys<T>;
