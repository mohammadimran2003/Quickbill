import { Checkbox, Chip, IconButton, Stack, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const useExpenseColumns = ({ onEditClick, onDeleteClick }) => {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          indeterminate={table.getIsSomePageRowsSelected()}
          onChange={table.getToggleAllPageRowsSelectedHandler()}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
          onChange={row.getToggleSelectedHandler()}
        />
      ),
    },
    { header: "Title", accessorKey: "title", enableSorting: true },
    {
      header: "Amount",
      accessorKey: "amount",
      cell: ({ getValue }) => `৳${getValue().toLocaleString()}`,
      enableSorting: true,
    },
    {
      header: "Date",
      accessorKey: "date",
      cell: ({ getValue }) => new Date(getValue()).toLocaleDateString(),
      enableSorting: true,
    },
    {
      header: "Category",
      accessorKey: "category.name",
      cell: ({ getValue }) => getValue() || "N/A",
      enableSorting: false,
    },
    {
      header: "Payment Method",
      accessorKey: "paymentMethod",
      cell: ({ getValue }) => getValue() || "N/A",
      enableSorting: false,
    },
    {
      header: "Note",
      accessorKey: "note",
      cell: ({ getValue }) => getValue() || "N/A",
      enableSorting: false,
    },
    {
      header: "Actions",
      id: "actions",
      cell: ({ row }) => (
        <Stack direction="row" spacing={1}>
          <Tooltip title="Edit">
            <IconButton
              size="small"
              color="primary"
              onClick={() => onEditClick(row.original)}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];
};

export default useExpenseColumns;
