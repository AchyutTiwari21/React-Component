import React from 'react'
import { cn } from '../../utils/cn'
import type { DataTableProps, Column } from './types'

type Order = 'asc' | 'desc' | null

function compareValues(a: unknown, b: unknown): number {
  // numbers
  if (typeof a === 'number' && typeof b === 'number') return a - b
  // dates
  const da = a instanceof Date ? a : new Date(String(a))
  const db = b instanceof Date ? b : new Date(String(b))
  if (!isNaN(+da) && !isNaN(+db)) return +da - +db
  // fallback string compare
  return String(a ?? '').localeCompare(String(b ?? ''), undefined, { numeric: true, sensitivity: 'base' })
}

function useSortedData<T>(data: T[], columns: Column<T>[]) {
  const [sortKey, setSortKey] = React.useState<keyof T | null>(null)
  const [order, setOrder] = React.useState<Order>(null)

  const sorted = React.useMemo(() => {
    if (!sortKey || !order) return data
    const copy = [...data]
    copy.sort((ra, rb) => {
      const col = columns.find(c => c.dataIndex === sortKey)
      if (!col) return 0
      const a = ra[sortKey]
      const b = rb[sortKey]
      const res = compareValues(a, b)
      return order === 'asc' ? res : -res
    })
    return copy
  }, [data, sortKey, order, columns])

  const toggleSort = (key: keyof T, enabled?: boolean) => {
    if (!enabled) return
    setSortKey(prev => (prev === key ? key : key))
    setOrder(prev => (prev === 'asc' ? 'desc' : prev === 'desc' ? null : 'asc'))
  }

  return { sorted, sortKey, order, toggleSort }
}

function DataTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  selectable = false,
  onRowSelect,
  className,
  emptyText = 'No data',
}: DataTableProps<T>) {
  const { sorted, sortKey, order, toggleSort } = useSortedData<T>(data, columns)
  const [selected, setSelected] = React.useState<Set<number>>(new Set())

  const allChecked = selectable && sorted.length > 0 && selected.size === sorted.length
  const someChecked = selectable && selected.size > 0 && selected.size < sorted.length

  const handleHeaderCheck = () => {
    if (allChecked) {
      setSelected(new Set())
      onRowSelect?.([])
    } else {
      const all = new Set(sorted.map((_, i) => i))
      setSelected(all)
      onRowSelect?.(sorted)
    }
  }

  const toggleRow = (idx: number) => {
    if (!selectable) return
    const next = new Set(selected)
    if (next.has(idx)) next.delete(idx)
    else next.add(idx)
    setSelected(next)
    onRowSelect?.(Array.from(next).map(i => sorted[i]))
  }

  return (
    <div className={cn('w-full overflow-hidden rounded-3xl border border-primary shadow-xl bg-card transition-all duration-300', className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-secondary">
            <tr>
              {selectable && (
                <th scope="col" className="w-12 px-6 py-4">
                  <div className="flex items-center justify-center">
                    <input
                      aria-label="Select all rows"
                      type="checkbox"
                      checked={allChecked}
                      ref={el => {
                        if (el) el.indeterminate = Boolean(someChecked)
                      }}
                      onChange={handleHeaderCheck}
                      className="w-4 h-4 text-blue-600 bg-white border-2 border-slate-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600 transition-all duration-200 hover:scale-110"
                    />
                  </div>
                </th>
              )}
              {columns.map((col) => {
                const isSorted = sortKey === col.dataIndex && !!order
                const ariaSort: React.AriaAttributes['aria-sort'] =
                  !col.sortable ? undefined : !isSorted ? 'none' : order === 'asc' ? 'ascending' : 'descending'
                return (
                  <th
                    key={col.key}
                    scope="col"
                    aria-sort={ariaSort}
                    className={cn(
                      'px-6 py-4 font-bold text-secondary-foreground transition-all duration-200',
                      col.sortable && 'cursor-pointer select-none hover:text-popover hover:bg-secondary'
                    )}
                    onClick={() => toggleSort(col.dataIndex, col.sortable)}
                  >
                    <div className="inline-flex items-center gap-2 group">
                      <span className="text-sm font-semibold tracking-wide uppercase">{col.title}</span>
                      {col.sortable && (
                        <div className={cn(
                          'flex flex-col items-center justify-center w-4 h-4 transition-all duration-200',
                          isSorted ? 'text-popover' : 'text-foreground'
                        )}>
                          {sortKey !== col.dataIndex || !order ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                            </svg>
                          ) : order === 'asc' ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          )}
                        </div>
                      )}
                    </div>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-primary">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={`skeleton-${i}`} className="animate-pulse">
                  {selectable && (
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center">
                        <div className="h-4 w-4 rounded bg-card" />
                      </div>
                    </td>
                  )}
                  {columns.map((c) => (
                    <td key={c.key} className="px-6 py-4">
                      <div className="h-4 bg-cards rounded animate-pulse" style={{ width: `${Math.random() * 60 + 40}%` }} />
                    </td>
                  ))}
                </tr>
              ))
            ) : sorted.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0)} className="px-6 py-12 text-center">
                  {emptyText}
                </td>
              </tr>
            ) : (
              sorted.map((row, i) => (
                <tr
                  key={i}
                  className={cn(
                    'group transition-all duration-200 hover:bg-primary',
                    selected.has(i) && 'bg-card border-l-4 border-blue-500',
                    selectable && 'cursor-pointer'
                  )}
                  onClick={() => toggleRow(i)}
                >
                  {selectable && (
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center">
                        <input
                          type="checkbox"
                          aria-label={`Select row ${i + 1}`}
                          checked={selected.has(i)}
                          onChange={() => toggleRow(i)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-4 h-4 text-blue-600 bg-white border-2 border-slate-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600 transition-all duration-200 hover:scale-110"
                        />
                      </div>
                    </td>
                  )}
                  {columns.map((col) => (
                    <td key={col.key} className="px-6 py-4 text-card-foreground font-medium group-hover:text-secondary-foreground group-hover:bg-secondary transition-colors duration-200">
                      {String(row[col.dataIndex] ?? '')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DataTable