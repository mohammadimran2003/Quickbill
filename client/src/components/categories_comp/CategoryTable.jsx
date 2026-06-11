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
import getCategories from "../../api/categories_api/getCategories.js";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import TablePagination from "@mui/material/TablePagination";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import { useSearchParams } from "react-router-dom";
import deleteCategory from "../../api/categories_api/deleteCategory.js";
import DeleteConfirmationDialog from "../shared/DeleteConfirmationDialog.jsx";
import { toast } from "sonner";

import useCategoryColumns from "./hooks/useCategoryColumns.jsx";
import CategoryFilterSection from "./CategoryFilterSection.jsx";
import TableSkeleton from "../shared/skeletons/TableSkeleton.jsx";

function CategoryTable({ onEditClick = () => {} }) {
  const [rowSelection, setRowSelection] = useState({});
  const [sorting, setSorting] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const queryClient = useQueryClient();

  const pageNumber = Number(searchParams.get("page")) || 1;
  const pageLimit = Number(searchParams.get("limit")) || 10;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["categories", Object.fromEntries(searchParams)],
    queryFn: () => getCategories(Object.fromEntries(searchParams)),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
      toast.success("Category deleted successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete category");
    },
  });

  const columns = useCategoryColumns({
    onEditClick,
    onDeleteClick: (category) => {
      setCategoryToDelete(category);
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
    rowCount: data?.count || 0,
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
      <CategoryFilterSection onSetSorting={() => setSorting([])} />
      <TableContainer
        component={Box}
        sx={{
          mt: 2,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 4,
        }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
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
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  align="center"
                  sx={{ py: 8, color: "text.secondary" }}
                >
                  <Box sx={{ textAlign: "center" }}>
                    <Typography variant="h6" fontWeight={600}>
                      No Categories Found
                    </Typography>
                    <Typography variant="body2">
                      Add your first category or adjust filters to see category
                      results.
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
        count={data?.count || 0}
        page={pageNumber - 1}
        onPageChange={(event, newPage) => {
          handlePageChange(newPage + 1);
        }}
        rowsPerPage={pageLimit}
        onRowsPerPageChange={(event) => {
          handleLimitChange(parseInt(event.target.value, 10));
        }}
        rowsPerPageOptions={[2, 5, 10, 25, 50, 100]}
      />
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setCategoryToDelete(null);
        }}
        onConfirm={() => deleteMutation.mutate(categoryToDelete.id)}
        title="Delete Category"
        message={`Are you sure you want to delete "${categoryToDelete?.name}"? This action cannot be undone and will permanently remove the category and all associated products.`}
        loading={deleteMutation.isPending}
      />
    </Paper>
  );
}

export default CategoryTable;
