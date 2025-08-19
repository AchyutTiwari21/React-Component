import React from 'react'
import InputField from './lib/InputField/InputField';
import DataTable from './lib/DataTable/DataTable';
import type { Column } from './lib/DataTable/types'

type User = { id: number; name: string; email: string; age: number }

const initial: User[] = [
  { id: 1, name: 'Alice', email: 'alice@example.com', age: 24 },
  { id: 2, name: 'Bob', email: 'bob@example.com', age: 31 },
  { id: 3, name: 'Cara', email: 'cara@example.com', age: 27 },
]

const columns: Column<User>[] = [
  { key: 'name', title: 'Name', dataIndex: 'name', sortable: true },
  { key: 'email', title: 'Email', dataIndex: 'email', sortable: true },
  { key: 'age', title: 'Age', dataIndex: 'age', sortable: true },
]

export default function App() {
  const [query, setQuery] = React.useState('')
  const [pwd, setPwd] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  const filtered = initial.filter(u =>
    [u.name, u.email].some(v => v.toLowerCase().includes(query.toLowerCase()))
  )

  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-[#0b0f19] dark:text-slate-100 p-6">
      <div className="mx-auto max-w-4xl space-y-8">
        <h1 className="text-2xl font-bold">UI Components Demo</h1>

        <div className="grid gap-6 md:grid-cols-2">
          <InputField
            label="Search users"
            placeholder="Type to filter..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            clearable
            onClear={() => setQuery('')}
            variant="filled"
            helperText="Filters the table below"
            loading={loading}
          />
          <InputField
            label="Password"
            type="password"
            placeholder="••••••••"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            invalid={pwd.length > 0 && pwd.length < 6}
            errorMessage="Minimum 6 characters"
            variant="outlined"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 1200) }}
            className="rounded-xl bg-slate-900 px-4 py-2 text-white hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900"
          >
            Simulate loading
          </button>
          <button
            onClick={() => document.documentElement.classList.toggle('dark')}
            className="rounded-xl border px-4 py-2"
          >
            Toggle dark
          </button>
        </div>

        <DataTable<User>
          data={filtered}
          columns={columns}
          selectable
          onRowSelect={(rows) => console.log('Selected rows', rows)}
        />
      </div>
    </div>
  )
}
