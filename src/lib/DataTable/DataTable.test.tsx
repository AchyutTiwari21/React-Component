import { render, screen, fireEvent, within } from '@testing-library/react'
import '@testing-library/jest-dom'
import { describe, it, expect, vi } from 'vitest'
import DataTable from './DataTable'
import type { Column } from './types'

type TestData = { id: number; name: string; age: number; email: string }

const columns: Column<TestData>[] = [
  { key: 'name', title: 'Name', dataIndex: 'name', sortable: true },
  { key: 'age', title: 'Age', dataIndex: 'age', sortable: true },
  { key: 'email', title: 'Email', dataIndex: 'email' },
]

const testData: TestData[] = [
  { id: 1, name: 'Alice', age: 24, email: 'alice@example.com' },
  { id: 2, name: 'Bob', age: 31, email: 'bob@example.com' },
  { id: 3, name: 'Charlie', age: 27, email: 'charlie@example.com' },
]

describe('DataTable', () => {
  it('renders without crashing', () => {
    render(<DataTable data={testData} columns={columns} />)
    expect(screen.getByRole('table')).toBeInTheDocument()
  })

  it('displays all data rows', () => {
    render(<DataTable data={testData} columns={columns} />)
    const rows = screen.getAllByRole('row')
    // +1 for header row
    expect(rows).toHaveLength(testData.length + 1)
  })

  it('sorts data when clicking sortable column headers', () => {
    render(<DataTable data={testData} columns={columns} />)
    
    // First click - sort ascending
    fireEvent.click(screen.getByText('Name'))
    const nameCells = screen.getAllByRole('row').slice(1).map(row => 
      within(row).getAllByRole('cell')[0].textContent
    )
    expect(nameCells).toEqual(['Alice', 'Bob', 'Charlie'])
    
    // Second click - sort descending
    fireEvent.click(screen.getByText('Name'))
    const descNameCells = screen.getAllByRole('row').slice(1).map(row => 
      within(row).getAllByRole('cell')[0].textContent
    )
    expect(descNameCells).toEqual(['Charlie', 'Bob', 'Alice'])
  })

  it('handles row selection when selectable is true', () => {
    const handleSelect = vi.fn()
    render(
      <DataTable 
        data={testData} 
        columns={columns} 
        selectable 
        onRowSelect={handleSelect} 
      />
    )
    
    // Click first row
    const firstRowCheckbox = screen.getByLabelText('Select row 1')
    fireEvent.click(firstRowCheckbox)
    
    expect(handleSelect).toHaveBeenCalledWith([testData[0]])
  })

  it('selects all rows when header checkbox is clicked', () => {
    const handleSelect = vi.fn()
    render(
      <DataTable 
        data={testData} 
        columns={columns} 
        selectable 
        onRowSelect={handleSelect} 
      />
    )
    
    // Click select all checkbox
    const selectAllCheckbox = screen.getByLabelText('Select all rows')
    fireEvent.click(selectAllCheckbox)
    
    expect(handleSelect).toHaveBeenCalledWith(testData)
  })

  it('shows loading state', () => {
    render(<DataTable data={[]} columns={columns} loading />)
    
    // Should show 5 skeleton rows
    const skeletonRows = document.querySelectorAll('tr.animate-pulse')
    expect(skeletonRows).toHaveLength(5)
  })

  it('displays empty state when no data', () => {
    const emptyText = 'No data available'
    render(<DataTable data={[]} columns={columns} emptyText={emptyText} />)
    
    expect(screen.getByText(emptyText)).toBeInTheDocument()
  })

  it('does not show checkboxes when selectable is false', () => {
    render(<DataTable data={testData} columns={columns} selectable={false} />)
    
    const checkboxes = screen.queryAllByRole('checkbox')
    expect(checkboxes).toHaveLength(0)
  })
})
