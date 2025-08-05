# @smart-api/client

Client-side library for the Smart Endpoint framework, providing tools for dynamic query building and React hooks for data fetching with Zod schema integration.

## Features

- **QueryBuilderSDK**: A lightweight SDK for building dynamic queries with Zod schema integration
  - Pagination handling with page size and navigation controls
  - Search functionality for full-text search with case-insensitive support
  - URL parameter generation for API requests
  - Nested property filtering with dot notation support
  - Pagination navigation helpers (hasNextPage, hasPrevPage, nextPage, prevPage)

- **React Hooks**:
  - `useListView`: A hook that provides a QueryBuilderSDK instance configured with your Zod schema

## Installation

```bash
npm install @smart-api/client
# or
yarn add @smart-api/client
# or
pnpm add @smart-api/client
```

## Usage

### QueryBuilderSDK

The QueryBuilderSDK provides a way to build dynamic queries based on Zod schemas:

```typescript
import { QueryBuilderSDK } from '@smart-api/client';
import { UserSchema } from './schemas';

// Create a new query builder instance with your Zod schema
const queryBuilder = new QueryBuilderSDK(UserSchema);

// Configure pagination
queryBuilder.setPage(1);
queryBuilder.setPageSize(25);

// Add search term
queryBuilder.setSearch('john');

// Build the query parameters
const queryParams = queryBuilder.build();
// Result: { page: 1, limit: 25, search: 'john' }

// Or build URL parameters
const urlParams = queryBuilder.buildUrlParams();
// Result: URLSearchParams with 'page=1&limit=25&search=john'
```

### React Hooks

```typescript
import { useListView } from '@smart-api/client/hooks';
import { UserSchema } from './schemas';

function UsersList() {
  // Create a query builder configured with your schema
  const queryBuilder = useListView(UserSchema, { pageSize: 25 });

  // Use the query builder methods
  const handleSearch = (term) => {
    queryBuilder.setSearch(term);
  };

  const handlePageChange = (page) => {
    queryBuilder.setPage(page);
  };

  // Get the current query parameters
  const params = queryBuilder.build();

  // Use these parameters in your API calls
  // ...

  return (
    <div>
      {/* Your UI components */}
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

#### Other Methods

- `reset()`: Reset pagination and search to default values
- `build()`: Build the query parameters object
- `buildUrlParams()`: Build URL parameters for API requests

### Hooks

#### useListView

```typescript
useListView(model: ZodTypeWithQueryable<any>, options?: { pageSize?: number })
```

Returns a QueryBuilderSDK instance configured with the provided Zod schema and options.

## Testing

```bash
npm test
# or
yarn test
# or
pnpm test
```

## License

UNLICENSED
