# React UI Components – InputField & DataTable

Tech: React + TypeScript + TailwindCSS + Storybook + Vitest + RTL

## Features
- **InputField**: label, helper, error, disabled/invalid/loading, variants (filled/outlined/ghost), sizes (sm/md/lg), optional **clear** & **password toggle**, light/dark.
- **DataTable**: typed columns, sorting, row selection (multi), loading & empty states, responsive, ARIA (`aria-sort`, labels).

## Getting Started
```bash
npm i
npm run dev         # Vite dev
npm run story       # Storybook
npm run test        # Vitest + RTL
npm run build       # app build
npm run build-storybook
```

## Usage

### InputField
```tsx
import { InputField } from './lib/InputField/InputField';

// Basic usage
<InputField 
  label="Email" 
  placeholder="you@example.com" 
  helperText="We'll never share your email." 
  variant="outlined"
  clearable
  onClear={() => console.log('Cleared!')}
/>
```

### DataTable
```tsx
import { DataTable } from './lib/DataTable/DataTable';
import type { Column } from './lib/DataTable/types';

type User = { id: number; name: string; email: string; age: number }

const columns: Column<User>[] = [
  { key: 'name', title: 'Name', dataIndex: 'name', sortable: true },
  { key: 'email', title: 'Email', dataIndex: 'email' },
  { key: 'age', title: 'Age', dataIndex: 'age', sortable: true },
]

// Basic usage
<DataTable<User> 
  data={users} 
  columns={columns} 
  selectable 
  onRowSelect={(rows) => console.log('Selected rows:', rows)}
  loading={isLoading}
  emptyText="No data available"
/>
```

## Structure
```
src/
  lib/
    InputField/
      InputField.tsx
      InputField.stories.tsx
      InputField.test.tsx
    DataTable/
      DataTable.tsx
      DataTable.stories.tsx
      DataTable.test.tsx
      types.ts
  utils/cn.ts
  App.tsx
  main.tsx
  index.css
```

## Approach
- **Accessibility**: Proper label → input id, `aria-invalid`, `aria-describedby`; table headers announce `aria-sort`.
- **Styling**: Tailwind with variants & sizes; dark mode via `dark` class.
- **Typing**: Generic `DataTable<T>` with `Column<T>` ensures compile-time safety.
- **Tests**: Behavior tests for error states, clear button, sorting, and selection.

## Deploying Storybook
Chromatic: `npx chromatic --project-token=<token>` after `npm run build-storybook`.

Or deploy the static `storybook-static` to Vercel/Netlify.

## Notes
- InputField supports controlled and uncontrolled usage. For controlled clear, pass `onClear` to reset parent state.
- Selection is multi-select. Hook into `onRowSelect` for current selection.
