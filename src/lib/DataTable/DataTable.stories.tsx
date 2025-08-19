import type { Meta, StoryObj } from '@storybook/react'
import DataTable from './DataTable'
import type { Column, DataTableProps } from './types'

type User = { id: number; name: string; email: string; age: number }

const columns: Column<User>[] = [
  { key: 'name', title: 'Name', dataIndex: 'name', sortable: true },
  { key: 'email', title: 'Email', dataIndex: 'email', sortable: true },
  { key: 'age', title: 'Age', dataIndex: 'age', sortable: true },
]

const data: User[] = [
  { id: 1, name: 'Alice', email: 'alice@example.com', age: 24 },
  { id: 2, name: 'Bob', email: 'bob@example.com', age: 31 },
  { id: 3, name: 'Cara', email: 'cara@example.com', age: 27 },
]

const meta: Meta<DataTableProps<User>> = {
  title: 'Components/DataTable',
  component: DataTable<User>,
  args: { data, columns },
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<DataTableProps<User>>

export const Basic: Story = {}

export const Sortable: Story = {
  args: { 
    data,
    columns,
    emptyText: 'No users found',
  },
}

export const Selectable: Story = {
  args: {
    data,
    columns,
    selectable: true,
    onRowSelect: (rows) => console.log('Selected Rows:', rows),
  },
}

export const Loading: Story = { 
  args: { 
    data: [], 
    columns, 
    loading: true,
  },
}

export const Empty: Story = { 
  args: { 
    data: [], 
    columns, 
    emptyText: 'No data available. Please add some data to get started.'
  },
}

export const WithCustomEmptyState: Story = {
  args: {
    data: [],
    columns,
    emptyText: (
      <div className="flex flex-col items-center gap-2 p-4">
        <svg className="h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 12H4" />
        </svg>
        <p className="text-slate-600">No records found</p>
        <button className="mt-2 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
          Add New Item
        </button>
      </div>
    ),
  },
}
