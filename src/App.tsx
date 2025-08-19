import React from 'react'
import InputField from './lib/InputField/InputField';
import DataTable from './lib/DataTable/DataTable';
import type { Column } from './lib/DataTable/types'

type User = { id: number; name: string; email: string; age: number }

const initial: User[] = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', age: 24 },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', age: 31 },
  { id: 3, name: 'Cara Williams', email: 'cara@example.com', age: 27 },
  { id: 4, name: 'David Brown', email: 'david@example.com', age: 35 },
  { id: 5, name: 'Emma Davis', email: 'emma@example.com', age: 29 },
]

const columns: Column<User>[] = [
  { key: 'name', title: 'Name', dataIndex: 'name', sortable: true },
  { key: 'email', title: 'Email', dataIndex: 'email', sortable: true },
  { key: 'age', title: 'Age', dataIndex: 'age', sortable: true },
]

// Sun and Moon icons as React components
const SunIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
)

const MoonIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
)

export default function App() {
  const [query, setQuery] = React.useState('')
  const [pwd, setPwd] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [isDark, setIsDark] = React.useState(false)

  const filtered = initial.filter(u =>
    [u.name, u.email].some(v => v.toLowerCase().includes(query.toLowerCase()))
  )

  const toggleDarkMode = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle('dark')
  }

  const simulateLoading = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 1500)
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-all duration-500">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              UI Components Demo
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              Interactive components with modern design
            </p>
          </div>
          
          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            className="group relative p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            aria-label="Toggle dark mode"
          >
            <div className="relative w-6 h-6">
              <div className={`absolute inset-0 transform transition-all duration-500 ${isDark ? 'rotate-180 opacity-0' : 'rotate-0 opacity-100'}`}>
                <SunIcon />
              </div>
              <div className={`absolute inset-0 transform transition-all duration-500 ${isDark ? 'rotate-0 opacity-100' : '-rotate-180 opacity-0'}`}>
                <MoonIcon />
              </div>
            </div>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-500 dark:from-blue-500 dark:to-purple-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
          </button>
        </div>

        {/* Input Fields Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-3">
            <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
            Input Components
          </h2>
          
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-2">
              <InputField
                label="Search Users"
                placeholder="Type to filter users..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                clearable
                onClear={() => setQuery('')}
                variant="filled"
                size="lg"
                helperText="Real-time filtering of the table below"
                loading={loading}
              />
            </div>
            
            <div className="space-y-2">
              <InputField
                label="Password"
                type="password"
                placeholder="Enter your password"
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                invalid={pwd.length > 0 && pwd.length < 6}
                errorMessage="Password must be at least 6 characters"
                variant="outlined"
                size="lg"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mb-12">
          <div className="flex flex-wrap gap-4">
            <button
              onClick={simulateLoading}
              disabled={loading}
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden"
            >
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
              <div className="relative flex items-center gap-2">
                {loading && (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                {loading ? 'Loading...' : 'Simulate Loading'}
              </div>
            </button>
            
            <button
              onClick={() => {
                setQuery('')
                setPwd('')
              }}
              className="group relative px-8 py-4 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-slate-100 dark:bg-slate-700 opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
              <span className="relative">Clear All</span>
            </button>
          </div>
        </div>

        {/* Data Table Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-3">
              <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full" />
              User Directory
            </h2>
            <div className="text-sm text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-full">
              {filtered.length} of {initial.length} users
            </div>
          </div>
          
          <div className="transform transition-all duration-500 hover:scale-[1.01]">
            <DataTable<User>
              data={filtered}
              columns={columns}
              selectable
              onRowSelect={(rows) => console.log('Selected users:', rows)}
              emptyText={
                <div className="flex flex-col items-center gap-4 py-12">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="text-slate-600 dark:text-slate-400 font-medium">No users found</p>
                    <p className="text-slate-500 dark:text-slate-500 text-sm mt-1">Try adjusting your search criteria</p>
                  </div>
                </div>
              }
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-700">
          <div className="text-center text-slate-500 dark:text-slate-400">
            <p className="text-sm">Built with React, TypeScript, and Tailwind CSS</p>
          </div>
        </div>
      </div>
    </div>
  )
}