import {useState} from "react";
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
} from '@tanstack/react-table'
import FileDataService from "../services/FileDataService";

const columnHelper = createColumnHelper<any>()
const columns = [
    columnHelper.accessor('invoiceNo', {
        header: () => <span>Invoice No</span>,
    }),
    columnHelper.accessor('stockCode', {
        header: () => <span>Stock Code</span>,
    }),
    columnHelper.accessor('customer', {
        header: () => <span>Customer</span>,
    }),
    columnHelper.accessor('country', {
        header: () => <span>Country</span>,
    }),
    columnHelper.accessor('description', {
        header: () => <span>Description</span>,
    }),
    columnHelper.accessor('quantity', {
        header: () => <span>Quantity</span>,
    }),
]

const UploadDataList = ({ data, setData }) => {
    const [count, setCount] = useState(0);
    const [searchTitle, setSearchTitle] = useState("");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(3);
    const [currentIndex, setCurrentIndex] = useState(-1);

    const pageSizes = [3, 6, 9];

    const onChangeSearchTitle = (e) => {
        const searchTitle = e.target.value;
        setSearchTitle(searchTitle);
    };

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const handlePageSizeChange = (event) => {
        setPageSize(event.target.value);
        setPage(1);
    };

    const getRequestParams = (searchTitle, page, pageSize) => {
        let params = {};

        if (searchTitle) {
            params["s"] = searchTitle;
        }

        if (page) {
            params["page"] = page - 1;
        }

        if (pageSize) {
            params["size"] = pageSize;
        }

        return params;
    };

    const retrieveSearchData = () => {
        const params = getRequestParams(searchTitle, page, pageSize);

        FileDataService.getAll(params)
            .then((response) => {
                const { data, totalPages } = response.data;

                setData(data);
                setCount(totalPages);

                console.log(response.data)
            })
            .catch((e) => {
                console.log(e);
            });
    }

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        debugTable: true
    })
    return (
        <div className="p-2">
            <div className="h-2"/>
            <div className="input-group mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search by title"
                    value={searchTitle}
                    onChange={onChangeSearchTitle}
                />
                <div className="input-group-append">
                    <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={retrieveSearchData}
                    >
                        Search
                    </button>
                </div>
            </div>
            <table>
                <thead>
                {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map(header => {
                            return (
                                <th key={header.id} colSpan={header.colSpan}>
                                    {header.isPlaceholder ? null : (
                                        <div>
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                        </div>
                                    )}
                                </th>
                            )
                        })}
                    </tr>
                ))}
                </thead>
                <tbody>
                {table.getRowModel().rows.map(row => {
                    return (
                        <tr key={row.id}>
                            {row.getVisibleCells().map(cell => {
                                return (
                                    <td key={cell.id}>
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </td>
                                )
                            })}
                        </tr>
                    )
                })}
                </tbody>
            </table>
            <div className="h-2"/>
            <div className="flex items-center gap-2">
                <button
                    className="border rounded p-1"
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                >
                    {'<<'}
                </button>
                <button
                    className="border rounded p-1"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    {'<'}
                </button>
                <button
                    className="border rounded p-1"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    {'>'}
                </button>
                <button
                    className="border rounded p-1"
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}
                >
                    {'>>'}
                </button>
                <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of {' '}
              {table.getPageCount()}
          </strong>
        </span>
                {/*        <span className="flex items-center gap-1">*/}
                {/*  | Go to page:*/}
                {/*  <input*/}
                {/*      type="number"*/}
                {/*      defaultValue={table.getState().pagination.pageIndex + 1}*/}
                {/*      onChange={e => {*/}
                {/*          const page = e.target.value ? Number(e.target.value) - 1 : 0*/}
                {/*          table.setPageIndex(page)*/}
                {/*      }}*/}
                {/*      className="border p-1 rounded w-16"*/}
                {/*  />*/}
                {/*</span>*/}

            </div>
            <div>{table.getRowModel().rows.length} Rows</div>
        </div>
    );
};

export default UploadDataList;