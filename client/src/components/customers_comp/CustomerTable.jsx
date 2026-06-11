import {
  Box,
  Paper,
  Table,
  TableContainer,
  Typography,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Stack,
} from "@mui/material";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import getCustomers from "../../api/customers_api/getCustomers.js";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import CircularProgress from "@mui/material/CircularProgress";
import TablePagination from "@mui/material/TablePagination";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import { useSearchParams } from "react-router-dom";
import deleteCustomer from "../../api/customers_api/deleteCustomer.js";
import DeleteConfirmationDialog from "../shared/DeleteConfirmationDialog.jsx";
import { toast } from "sonner";

import useCustomerColumns from "./hooks/useCustomerColumns.jsx";
import CustomerFilterSection from "./CustomerFilterSection.jsx";
import TableSkeleton from "../shared/skeletons/TableSkeleton.jsx";

function CustomerTable({ onEditClick = () => {} }) {
  const [rowSelection, setRowSelection] = useState({});
  const [sorting, setSorting] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const pageNumber = Number(searchParams.get("page"));
  const pageLimit = Number(searchParams.get("limit")) || 1;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["customers", Object.fromEntries(searchParams)],
    queryFn: () => getCustomers(Object.fromEntries(searchParams)),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      setDeleteDialogOpen(false);
      setCustomerToDelete(null);
      toast.success("Customer deleted successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete customer");
    },
  });

  const columns = useCustomerColumns({
    onEditClick,
    onDeleteClick: (customer) => {
      setCustomerToDelete(customer);
      setDeleteDialogOpen(true);
    },
  });

  const handlePageChange = (newPage) => {
    setSearchParams((prev) => ({
      ...Object.fromEntries(prev),
      page: newPage,
    }));
  };

  const handleLimitChange = (newLimit) => {
    setSearchParams((prev) => ({
      ...Object.fromEntries(prev),
      limit: newLimit,
      page: 1,
    }));
  };

  const table = useReactTable({
    data: data?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      rowSelection,
      sorting,
    },
    manualPagination: true,
    manualSorting: true,
    rowCount: data?.pagination?.total || 0,
    onRowSelectionChange: setRowSelection,
    onSortingChange: (updater) => {
      const newSorting =
        typeof updater === "function" ? updater(sorting) : updater;

      setSorting(newSorting);

      setSearchParams((prev) => ({
        ...Object.fromEntries(prev),
        sortBy: newSorting[0]?.id || "createdAt",
        sortOrder: newSorting[0]?.desc ? "desc" : "asc",
        page: 1,
      }));
    },
    getRowId: (row) => row.id,
  });

  if (isLoading) return <TableSkeleton />;
  if (isError) return <Typography>Something went wrong</Typography>;
  return (
    <Paper
      sx={{
        mt: 2,

        p: 4,
        borderRadius: 4,
        overflowX: "auto",
      }}
    >
      <CustomerFilterSection onSetSorting={() => setSorting([])} />
      <TableContainer
        component={Box}
        sx={{
          mt: 2,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 4,
        }}
      >
        {/* Table structure will go here */}
        <Table sx={{ minWidth: 650 }}>
          {/* TableHead and TableBody will be defined here */}
          <TableHead sx={{ bgcolor: "background.neutral" }}>
            <TableRow>
              {table.getHeaderGroups()[0].headers.map((header) => (
                <TableCell
                  key={header.id}
                  sx={{ fontWeight: "bold" }}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <Stack direction="row" gap={0.5}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                    {/* Sort Icon */}
                    {header.column.getIsSorted() === "asc" && (
                      <ArrowUpwardIcon fontSize="small" />
                    )}
                    {header.column.getIsSorted() === "desc" && (
                      <ArrowDownwardIcon fontSize="small" />
                    )}
                    {!header.column.getIsSorted() &&
                      header.column.getCanSort() && (
                        <UnfoldMoreIcon
                          fontSize="small"
                          sx={{ color: "text.disabled" }}
                        />
                      )}
                  </Stack>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody
            sx={{
              "& tr:last-child td": {
                borderBottom: 0,
              },
            }}
          >
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow selected={row.getIsSelected()} key={row.id}>
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
              /* Data na thakle ei Row-ti dekhabe */
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  align="center"
                  sx={{ py: 8, color: "text.secondary" }}
                >
                  <Box sx={{ textAlign: "center" }}>
                    <Typography variant="h6" fontWeight={600}>
                      No Customers Found
                    </Typography>
                    <Typography variant="body2">
                      It looks like you haven't added any customers yet.
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={data?.pagination?.total || 0}
        page={pageNumber - 1}
        onPageChange={(event, newPage) => {
          handlePageChange(newPage + 1);
        }}
        rowsPerPage={pageLimit}
        onRowsPerPageChange={(event) => {
          handleLimitChange(parseInt(event.target.value, 10));
        }}
        rowsPerPageOptions={[1, 2, 5, 10, 25, 50]}
      />
      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setCustomerToDelete(null);
        }}
        onConfirm={() => deleteMutation.mutate(customerToDelete.id)}
        title="Delete Customer"
        message={`Are you sure you want to delete "${customerToDelete?.name}"? This action cannot be undone and will permanently remove the customer and all associated data.`}
        loading={deleteMutation.isPending}
      />
    </Paper>
  );
}

export default CustomerTable;
