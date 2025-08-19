export interface Column<T> {
  key: string
  title: string
  dataIndex: keyof T
  sortable?: boolean
}

export interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  loading?: boolean
  selectable?: boolean
  onRowSelect?: (selectedRows: T[]) => void
  className?: string
  emptyText?: React.ReactNode
}
