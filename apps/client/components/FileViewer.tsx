import { Spinner } from './Spinner'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Document, Page } from 'react-pdf'
import { pdfjs } from 'react-pdf'
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from 'ui'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import 'react-pdf/dist/esm/Page/TextLayer.css'
import { ReviewType } from '.prisma/client'
import { reviewTypesOpts } from '@/constants/review'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

interface Props {
  src: string
}

const Loading = () => {
  return (
    <div className="min-w-lg w-full flex items-center justify-center h-20">
      <Spinner />
    </div>
  )
}

const ImageViewer = (props: Props) => {
  return (
    <div>
      <img src={props.src} />
    </div>
  )
}

const PDFViewer = (props: Props) => {
  const [numPages, setNumPages] = useState<number>()
  const [pageNumber, setPageNumber] = useState(1)
  const [src] = useState(props.src)

  const ref = useRef<HTMLDivElement>(undefined)
  const pageRef = useRef<HTMLCanvasElement>(undefined)

  const onDocumentLoadSuccess = useCallback(
    ({ numPages }: { numPages: number }) => {
      setNumPages(numPages)
    },
    []
  )

  return (
    <Document file={src} onLoadSuccess={onDocumentLoadSuccess}>
      <div
        style={{
          height: pageRef?.current?.height,
        }}
        ref={ref}
        className="border-2 border-gray-300 text-center w-full"
      >
        <div className="bg-gray-100 h-10 flex flex-row items-center space-x-3 font-bold mb-5">
          <Select
            value={pageNumber.toString()}
            onValueChange={(value) => setPageNumber(Number(value))}
          >
            <SelectTrigger className="w-20 bg-white">
              <SelectValue placeholder="Select a page" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {new Array(numPages).fill(null).map((_, index) => {
                  const pageNumber = index + 1

                  return (
                    <SelectItem key={index} value={pageNumber.toString()}>
                      {pageNumber}
                    </SelectItem>
                  )
                })}
              </SelectGroup>
              <SelectSeparator />
            </SelectContent>
          </Select>
          <span>/</span>
          <p>{numPages}</p>
        </div>
        {ref.current && (
          <Page
            canvasRef={pageRef}
            width={ref.current.clientWidth}
            pageNumber={pageNumber}
          />
        )}
      </div>
    </Document>
  )
}

const DocxViewer = (props: Props) => {
  const [isLoading, setIsLoading] = useState(false)

  const ref = useRef<HTMLDivElement>(null)

  const docx2html = useCallback(() => {
    setIsLoading(true)

    fetch(props.src).then((res) => {
      res.arrayBuffer().then((buffer) => {
        import('mammoth/mammoth.browser').then((mammoth) => {
          console.log('mammoth', buffer)
          mammoth
            .convertToHtml({ arrayBuffer: buffer })
            .then((displayResult) => {
              if (ref.current) {
                ref.current.innerHTML = displayResult.value
              }
            })
        })
      })
    })
  }, [])

  useEffect(() => {
    docx2html()
  }, [])

  return (
    <div
      className="bg-white shadow-2xl rounded-lg border border-gray-200 p-3"
      ref={ref}
    >
      {isLoading && <Loading />}
    </div>
  )
}

const CSVViewer = (props: Props) => {
  const [data, setData] = useState<object[]>([])
  const [csvFields, setCsvFields] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const parseCSV = useCallback(() => {
    setIsLoading(true)

    fetch(props.src).then((res) => {
      res.text().then((csv) => {
        import('papaparse').then((paparse) => {
          paparse.parse(csv, {
            header: true,
            complete: (results) => {
              setCsvFields(results.meta.fields || [])
              setData(results.data as object[])

              setIsLoading(false)
            },
          })
        })
      })
    })
  }, [])

  useEffect(() => {
    parseCSV()
  }, [])

  const columns = useMemo((): ColumnDef<object>[] => {
    return csvFields.map((field) => {
      return {
        accessorKey: field,
        header: field,
        accessor: field,
      }
    })
  }, [csvFields.length])

  const table = useReactTable({
    getCoreRowModel: getCoreRowModel(),
    columns,
    data,
  })

  if (isLoading) {
    return <Loading />
  }

  return (
    <div>
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
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
              >
                {row.getVisibleCells().map((cell, index) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
    </div>
  )
}

const FileViewer = (props: { extension: string; src: string }) => {
  return (
    <div className="mt-5 items-center flex justify-center ">
      <div className="w-full max-w-5xl">
        {(() => {
          switch (props.extension) {
            case 'gif':
            case 'jpg':
            case 'jpeg':
            case 'png':
              return <ImageViewer src={props.src} />

            case 'pdf':
              return <PDFViewer src={props.src} />

            case 'doc':
            case 'docx':
              return <DocxViewer src={props.src} />

            case 'csv':
              return <CSVViewer src={props.src} />

            default:
              return null
          }
        })()}
      </div>
    </div>
  )
}

export default FileViewer
