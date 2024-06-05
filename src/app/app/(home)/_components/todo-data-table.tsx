'use client'

import * as React from 'react'
import {
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
} from '@radix-ui/react-icons'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'

import { Button } from '@/components/ui/button'
// import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
// import { finished } from 'stream'
import { Badge } from '@/components/ui/badge'

export type Todo = {
  id: string
  titulo: string
  createdAt: Date
  updateAt: Date
  finishedAt?: Date
}

const data: Todo[] = [
  {
    id: '1',
    titulo: 'Estudar TypeScript',
    createdAt: new Date('2023-06-01T10:00:00Z'),
    updateAt: new Date('2023-06-01T10:00:00Z'),
    finishedAt: new Date('2023-06-01T12:00:00Z'),
  },
  {
    id: '2',
    titulo: 'Ler livro sobre JavaScript',
    createdAt: new Date('2023-06-02T11:30:00Z'),
    updateAt: new Date('2023-06-02T11:30:00Z'),
  },
  {
    id: '3',
    titulo: 'Desenvolver projeto de programação',
    createdAt: new Date('2023-06-03T14:00:00Z'),
    updateAt: new Date('2023-06-03T14:00:00Z'),
  },
  {
    id: '4',
    titulo: 'Assistir palestra sobre tecnologia',
    createdAt: new Date('2023-06-04T09:00:00Z'),
    updateAt: new Date('2023-06-04T09:00:00Z'),
    finishedAt: new Date('2023-06-04T10:30:00Z'),
  },
  {
    id: '5',
    titulo: 'Fazer exercício de lógica',
    createdAt: new Date('2023-06-05T08:00:00Z'),
    updateAt: new Date('2023-06-05T08:00:00Z'),
  },
  {
    id: '6',
    titulo: 'Revisar conceitos de algoritmos',
    createdAt: new Date('2023-06-06T13:00:00Z'),
    updateAt: new Date('2023-06-06T13:00:00Z'),
    finishedAt: new Date('2023-06-06T15:00:00Z'),
  },
  {
    id: '7',
    titulo: 'Praticar desafios de código',
    createdAt: new Date('2023-06-07T16:00:00Z'),
    updateAt: new Date('2023-06-07T16:00:00Z'),
  },
  {
    id: '8',
    titulo: 'Atualizar documentação do projeto',
    createdAt: new Date('2023-06-08T09:00:00Z'),
    updateAt: new Date('2023-06-08T09:00:00Z'),
  },
  {
    id: '9',
    titulo: 'Participar de reunião de equipe',
    createdAt: new Date('2023-06-09T10:30:00Z'),
    updateAt: new Date('2023-06-09T10:30:00Z'),
    finishedAt: new Date('2023-06-09T11:30:00Z'),
  },
  {
    id: '10',
    titulo: 'Preparar apresentação para o cliente',
    createdAt: new Date('2023-06-10T14:00:00Z'),
    updateAt: new Date('2023-06-10T14:00:00Z'),
  },
]

export const columns: ColumnDef<Todo>[] = [
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const { finishedAt } = row.original
      const status: 'done' | 'waiting' = finishedAt ? 'done' : 'waiting'

      return <Badge>{status}</Badge>
    },
  },
  {
    accessorKey: 'titulo',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Titulo
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.getValue('titulo')}</div>,
  },
  {
    accessorKey: 'createdAt',
    header: () => <div className="text-right">Data Criação</div>,
    cell: ({ row }) => {
      return (
        <div className="text-right font-medium">
          {row.original.createdAt.toLocaleDateString()}
        </div>
      )
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const todo = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <DotsHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(todo.id)}
            >
              Copiar ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Marcar como feito</DropdownMenuItem>
            <DropdownMenuItem>Excluir</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export function TodoDataTable() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Buscar tarefa..."
          value={(table.getColumn('titulo')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('titulo')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Colunas <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
