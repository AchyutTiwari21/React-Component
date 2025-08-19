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
    <div className={cn('w-full overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800', className)}>
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 dark:bg-slate-900/60">
          <tr>
            {selectable && (
              <th scope="col" className="w-10 px-3 py-3">
                <input
                  aria-label="Select all rows"
                  type="checkbox"
                  checked={allChecked}
                  ref={el => {
                    if (el) el.indeterminate = Boolean(someChecked)
                  }}
                  onChange={handleHeaderCheck}
                  className="rounded"
                />
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
                  className={cn('px-4 py-3 font-semibold text-slate-600 dark:text-slate-300', col.sortable && 'cursor-pointer select-none')}
                  onClick={() => toggleSort(col.dataIndex, col.sortable)}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.title}
                    {col.sortable && (
                      <span aria-hidden className="text-xs opacity-70">
                        {sortKey !== col.dataIndex || !order ? '↕' : order === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </span>
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <tr key={`skeleton-${i}`} className="animate-pulse">
                {selectable && <td className="px-3 py-3"><div className="h-4 w-4 rounded bg-slate-200 dark:bg-slate-800" /></td>}
                {columns.map((c) => (
                  <td key={c.key} className="px-4 py-3">
                    <div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-800" />
                  </td>
                ))}
              </tr>
            ))
          ) : sorted.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (selectable ? 1 : 0)} className="px-4 py-10 text-center text-slate-500">
                {emptyText}
              </td>
            </tr>
          ) : (
            sorted.map((row, i) => (
              <tr
                key={i}
                className={cn('hover:bg-slate-50/80 dark:hover:bg-slate-900/40', selectable && 'cursor-pointer')}
                onClick={() => toggleRow(i)}
              >
                {selectable && (
                  <td className="px-3 py-3">
                    <input
                      type="checkbox"
                      aria-label={`Select row ${i + 1}`}
                      checked={selected.has(i)}
                      onChange={() => toggleRow(i)}
                      onClick={(e) => e.stopPropagation()}
                      className="rounded"
                    />
                  </td>
                )}
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-slate-800 dark:text-slate-200">
                    {String(row[col.dataIndex] ?? '')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default DataTable
