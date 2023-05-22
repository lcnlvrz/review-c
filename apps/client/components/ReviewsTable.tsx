import { CreateReview } from './CreateReview'
import { Input } from './Input'
import type { ListReviewsOutput } from '@/../../packages/common'
import { currentWorkspaceAtom } from '@/atoms/pageProps'
import { REVIEWS_QUERY_KEY } from '@/constants/query-keys'
import { ReviewService } from '@/services/review.service'
import { useQuery } from '@tanstack/react-query'
import {
  ColumnDef,
  PaginationState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import type { Review } from 'database'
import dayjs from 'dayjs'
import { useAtomValue } from 'jotai'
import debounce from 'lodash/debounce'
import { Search } from 'lucide-react'
import Link from 'next/link'
import { useCallback, useMemo, useState } from 'react'
import {
  DataTablePagination,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'ui'

export const REVIEWS_PAGINATION_DEFAULT_VALUE = {
  pageSize: 10,
  pageIndex: 0,
}

export const ReviewsTable = (props: {
  reviews: ListReviewsOutput['reviews']
}) => {
  const currentWorkspace = useAtomValue(currentWorkspaceAtom)

  const [pages, setPages] = useState<number>()

  const [pagination, setPagination] = useState<
    PaginationState & { total?: number; search?: string }
  >(REVIEWS_PAGINATION_DEFAULT_VALUE)

  const { data } = useQuery(
    [REVIEWS_QUERY_KEY, pagination] as const,
    (ctx) => {
      const [_, { pageIndex, pageSize, search }] = ctx.queryKey

      return ReviewService.paginateReviews(currentWorkspace.id, {
        page: pageIndex + 1,
        limit: pageSize,
        search,
      }).then((res) => {
        setPages(res.pages)
        return res.reviews
      })
    },
    {
      retry: 1,
      initialData: props.reviews,
      refetchOnMount: true,
    }
  )

  const columns = useMemo(
    (): ColumnDef<Review>[] => [
      {
        header: 'Title',
        accessorKey: 'title',
      },
      {
        header: 'Type',
        accessorKey: 'type',
      },
      {
        header: 'Created',
        accessorFn: (review) =>
          dayjs(review.createdAt).format('MMM DD, YYYY HH:mm'),
      },
    ],
    []
  )

  const table = useReactTable<Review>({
    columns,
    data: data || [],
    getCoreRowModel: getCoreRowModel(),
    onPaginationChange: setPagination,
    pageCount: pages,
    manualPagination: true,
    state: {
      pagination,
    },
  })

  const onSearch = useCallback((search: string) => {
    setPagination({
      ...REVIEWS_PAGINATION_DEFAULT_VALUE,
      search,
    })
  }, [])

  const searchDebounced = useCallback(debounce(onSearch, 1000), [])

  return (
    <div className="flex flex-col space-y-5">
      <div className="w-full flex flex-row justify-between">
        <div className="max-w-sm w-full">
          <Input
            onChange={(e) => searchDebounced(e.target.value)}
            size="md"
            leftIcon={<Search className="w-5 h-5" />}
          />
        </div>
        <CreateReview />
      </div>
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
                          header.getContext()
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
                className="hover:bg-muted/50"
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
              >
                {row.getVisibleCells().map((cell, index) => (
                  <TableCell className="p-0" key={cell.id}>
                    <Link
                      key={index}
                      className="block inset-0 w-full h-full p-4"
                      href={`/workspace/${currentWorkspace.id}/review/${row.original.id}`}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </Link>
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <DataTablePagination table={table} />
    </div>
  )
}
