import {
  ZodTypeWithQueryable,
  getSortable,
  nestedToDotObject,
} from '@jullury-fluent/smart-api-common';

import { Order } from '@jullury-fluent/smart-api-common';

export class SortQuery<T extends ZodTypeWithQueryable<any>> {
  private schema: T;

  private sort: {
    order_by: string;
    order_type: Order;
  } | null = null;

  private sortable: Record<string, true>;

  constructor(schema: T) {
    this.schema = schema;
    this.sortable = nestedToDotObject(getSortable(this.schema as any));
  }

  private isKeyPathSortable = (keyPath: string): boolean => {
    const keyPathString = keyPath.toString();
    return this.sortable[keyPathString] === true;
  };

  public addSort(key: string, order: Order): void {
    if (this.isKeyPathSortable(key)) {
      this.sort = {
        order_by: key,
        order_type: order,
      };
    } else {
      throw new Error(`Invalid sort key: ${key}`);
    }
  }

  public updateSort(key: string, order: Order): void {
    if (!this.sort || this.sort.order_by !== key) {
      throw new Error(`Sort key not found or does not match current sort: ${key}`);
    }

    if (this.isKeyPathSortable(key)) {
      this.sort.order_type = order;
    } else {
      throw new Error(`Invalid sort key: ${key.toString()}`);
    }
  }

  public removeSort(key: string): void {
    if (this.sort && this.sort.order_by === key) {
      this.sort = null;
    } else {
      throw new Error(`Sort key not found: ${key}`);
    }
  }

  public reset(): void {
    this.sort = null;
  }

  public getSort(): {
    order_by: string;
    order_type: 'ASC' | 'DESC';
  } | null {
    return this.sort;
  }
}
