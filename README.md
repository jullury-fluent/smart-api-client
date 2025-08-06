# @jullury-fluent/smart-api-client

Client-side library for the Smart API framework, providing tools for dynamic query building and React hooks for data fetching with Zod schema integration.

## Features

- **QueryBuilderSDK**: A lightweight SDK for building dynamic queries with Zod schema integration
  - Pagination handling with page size and navigation controls
  - Search functionality for full-text search with case-insensitive support
  - URL parameter generation for API requests
  - Nested property filtering with dot notation support
  - Pagination navigation helpers (hasNextPage, hasPrevPage, nextPage, prevPage)
  - Advanced filtering with multiple conditions and operators

- **React Hooks**:
  - `useListView`: A hook that provides a QueryBuilderSDK instance configured with your Zod schema
  - `useFilter`: A hook for managing complex filter conditions
  - `usePagination`: A hook for pagination state management
  - `useSearch`: A hook for search functionality
  - `useSort`: A hook for sorting data by different fields

## Installation

```bash
npm install @jullury-fluent/smart-api-client
# or
yarn add @jullury-fluent/smart-api-client
# or
pnpm add @jullury-fluent/smart-api-client
```

## Usage

### QueryBuilderSDK

The QueryBuilderSDK provides a way to build dynamic queries based on Zod schemas:

```typescript
import { QueryBuilderSDK } from '@jullury-fluent/smart-api-client';
import { UserSchema } from './schemas';

// Create a new query builder instance with your Zod schema
const queryBuilder = new QueryBuilderSDK(UserSchema);

// Configure pagination
queryBuilder.setPage(1);
queryBuilder.setPageSize(25);

// Add search term
queryBuilder.setSearch('john');

// Add filters
queryBuilder.applyFilters([
  { field: 'status', operator: 'eq', value: 'active' },
  { field: 'company.name', operator: 'contains', value: 'Tech' },
]);

// Add sorting
queryBuilder.addSort('createdAt', 'DESC');

// Build the query parameters
const queryParams = queryBuilder.build();
// Result: { page: 1, limit: 25, search: 'john', filter: {...}, sort: {...} }

// Or build URL parameters
const urlParams = queryBuilder.buildUrlParams();
```

### React Hooks

```typescript
import { useGetUsersQuery } from './hooks/useGetUsersQuery';
import { UserSchema } from './schemas';

function UsersList() {
  // Use the custom hook that leverages the QueryBuilderSDK
  const { pagination, search, data, sort, filter } = useGetUsersQuery();

  // Handle search
  const handleSearch = (term) => {
    search.setSearch(term);
  };

  // Handle sorting
  const handleSort = (field) => {
    sort.addSort(field, 'ASC');
  };

  // Handle filtering
  const applyFilters = (filters) => {
    filter.applyFilters(filters);
  };

  return (
    <div>
      {/* Your UI components */}
      <SearchInput
        value={search.getSearch()}
        onChange={(e) => search.setSearch(e.target.value)}
      />

      <Table>
        {/* Table headers with sort functionality */}
        {/* Table rows with data */}
      </Table>

      <Pagination
        current={pagination.getPagination().page}
        total={pagination.getPagination().total}
        onNext={pagination.nextPage}
        onPrev={pagination.prevPage}
      />
    </div>
  );
}
```

## API Reference

### QueryBuilderSDK

#### Constructor

```typescript
new QueryBuilderSDK(schema: ZodTypeWithQueryable<any>)
```

Creates a new QueryBuilderSDK instance with the provided Zod schema.

#### Pagination Methods

- `setPage(page: number)`: Set the current page number
- `setPageSize(size: number)`: Set the page size
- `hasNextPage()`: Check if there is a next page
- `hasPrevPage()`: Check if there is a previous page
- `nextPage()`: Move to the next page
- `prevPage()`: Move to the previous page
- `setTotal(total: number)`: Set the total number of items
- `getPagination()`: Get the current pagination state

#### Search Methods

- `setSearch(search: string)`: Set the search term
- `getSearch()`: Get the current search term

#### Filter Methods

- `applyFilters(filters: FilterItem[])`: Apply an array of filter conditions
- `getFilters()`: Get the current filter conditions

#### Sort Methods

- `addSort(field: string, direction: 'ASC' | 'DESC')`: Add a sort condition
- `getSort()`: Get the current sort condition
- `reset()`: Reset sort to default values

#### Other Methods

- `reset()`: Reset all parameters to default values
- `build()`: Build the query parameters object
- `buildUrlParams()`: Build URL parameters for API requests

## License

UNLICENSED
