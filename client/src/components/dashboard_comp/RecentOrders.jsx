import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  Chip,
} from "@mui/material";
import getRecentOrders from "../../api/dashboard_api/getRecentOrders";
import { useQuery } from "@tanstack/react-query";
import getRecentOrderTableColumn from "./getRecentOrderTableColumn";

const RecentOrders = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["recentOrders"],
    queryFn: () => getRecentOrders(),
  });

  const columns = getRecentOrderTableColumn();

  // 2. Table Instance
  const table = useReactTable({
    data: data?.data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography>Loading recent orders data...</Typography>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography color="error">Failed to load recent orders data</Typography>
      </Box>
    );
  }
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 4,
        border: "1px solid",
        borderColor: "divider",
        width: "100%",
      }}
    >
      {/* Heading Section */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" fontWeight={700} color="text.primary">
          Recent Orders
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage and view the latest transactions
        </Typography>
      </Box>

      {/* TanStack Table Section */}
      <TableContainer component={Box} sx={{ border: "none" }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: "background.neutral" }}>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableCell
                    key={header.id}
                    sx={{
                      fontWeight: 700,
                      color: "text.secondary",
                      py: 2,
                    }}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                hover
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} sx={{ py: 2 }}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default RecentOrders;
