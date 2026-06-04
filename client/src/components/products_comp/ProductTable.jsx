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
  CircularProgress,
} from "@mui/material";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import TablePagination from "@mui/material/TablePagination";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import { toast } from "sonner";
import getProducts from "../../api/products_api/getProducts";
import deleteProduct from "../../api/products_api/deleteProduct";
import getCategories from "../../api/categories_api/getCategories";
import getBrands from "../../api/brands_api/getBrands";
import DeleteConfirmationDialog from "../shared/DeleteConfirmationDialog";
import ProductFilterSection from "./ProductFilterSection";
import useProductColumns from "./hooks/useProductColumns";
import TableSkeleton from "../shared/skeletons/TableSkeleton";

function ProductTable({ onEditClick = () => {} }) {
  const [rowSelection, setRowSelection] = useState({});
  const [sorting, setSorting] = useState([]);

  const [productToDelete, setProductToDelete] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();

  const pageNumber = Number(searchParams.get("page")) || 1;
  const pageLimit = Number(searchParams.get("limit")) || 10;

  // ── Queries ────────────────────────────────────────────────
  const { data, isLoading, isError } = useQuery({
    queryKey: ["products", Object.fromEntries(searchParams)],
    queryFn: () => getProducts(Object.fromEntries(searchParams)),
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });

  const { data: brands } = useQuery({
    queryKey: ["brands"],
    queryFn: () => getBrands(),
  });

  // ── Mutations ──────────────────────────────────────────────
  const { mutate: deleteMutation, isPending } = useMutation({
    mutationFn: (id) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
      setDeleteDialogOpen(false);
      setProductToDelete(null);
      toast.success("Product deleted successfully");
    },
    onError: (err) => {
      toast.error(err?.message || "Something went wrong!");
    },
  });

  // ── Columns ────────────────────────────────────────────────
  const columns = useProductColumns({
    onDeleteClick: (product) => {
      setProductToDelete(product);
      setDeleteDialogOpen(true);
    },
    onEditClick,
  });

  // ── Handlers ───────────────────────────────────────────────
  const handlePageChange = (newPage) => {
    setSearchParams((prev) => ({ ...Object.fromEntries(prev), page: newPage }));
  };

  const handleLimitChange = (newLimit) => {
    setSearchParams((prev) => ({
      ...Object.fromEntries(prev),
      limit: newLimit,
      page: 1,
    }));
  };

  const handleSortingChange = (updater) => {
    const newSorting =
      typeof updater === "function" ? updater(sorting) : updater;
    setSorting(newSorting);
    setSearchParams((prev) => ({
      ...Object.fromEntries(prev),
      sortBy: newSorting[0]?.id || "createdAt",
      sortOrder: newSorting[0]?.desc ? "desc" : "asc",
      page: 1,
    }));
  };

  // ── Table ──────────────────────────────────────────────────
  const table = useReactTable({
    data: data?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: { rowSelection, sorting },
    manualPagination: true,
    manualSorting: true,
    rowCount: data?.count || 0,
    onRowSelectionChange: setRowSelection,
    onSortingChange: handleSortingChange,
    getRowId: (row) => row.id,
  });

  // ── Render ─────────────────────────────────────────────────
  if (isLoading) return <TableSkeleton />;
  if (isError) return <Typography>Something went wrong</Typography>;

  return (
    <Paper sx={{ mt: 2, p: 4, borderRadius: 4, overflowX: "auto" }}>
      <ProductFilterSection
        categories={categories}
        brands={brands}
        onSetSorting={() => setSorting([])}
      />

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

          <TableBody sx={{ "& tr:last-child td": { borderBottom: 0 } }}>
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
                  sx={{ py: 8 }}
                >
                  <Box sx={{ textAlign: "center" }}>
                    <Typography variant="h6" fontWeight={600}>
                      No Products Found
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Add your first product or adjust filters to see results.
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
        onPageChange={(_, newPage) => handlePageChange(newPage + 1)}
        rowsPerPage={pageLimit}
        onRowsPerPageChange={(e) =>
          handleLimitChange(parseInt(e.target.value, 10))
        }
        rowsPerPageOptions={[10, 25, 50, 100]}
      />

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setProductToDelete(null);
        }}
        onConfirm={() => deleteMutation(productToDelete?.id)}
        title="Delete Product"
        message={`Are you sure you want to delete "${productToDelete?.name}"? This action cannot be undone.`}
        loading={isPending}
      />
    </Paper>
  );
}

export default ProductTable;
