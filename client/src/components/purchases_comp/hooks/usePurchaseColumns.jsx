import { Checkbox, Chip, IconButton, Stack, Tooltip } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import CancelIcon from "@mui/icons-material/Cancel";
import useFmt from "../../../hooks/useFmt.js";

const usePurchaseColumns = () => {
  const navigate = useNavigate();
  const fmt = useFmt();

  const getStatusColor = (status) => {
    switch (status) {
      case "RECEIVED":
        return "success";
      case "ORDERED":
        return "warning";
      case "CANCELLED":
        return "error";
      default:
        return "default";
    }
  };

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
    {
      header: "Purchase No",
      accessorKey: "purchaseNumber",
      enableSorting: true,
    },
    {
      header: "Supplier",
      accessorKey: "supplier.name",
      cell: ({ getValue }) => getValue() || "N/A",
      enableSorting: false,
    },
    {
      header: "Total",
      accessorKey: "total",
      cell: ({ getValue }) => fmt(getValue()?.toFixed(2)) || "0.00",
      enableSorting: true,
    },
    {
      header: "Paid",
      accessorKey: "paidAmount",
      cell: ({ getValue }) => fmt(getValue()?.toFixed(2)) || "0.00",
      enableSorting: true,
    },
    {
      header: "Due",
      accessorKey: "dueAmount",
      cell: ({ getValue }) => fmt(getValue()?.toFixed(2)) || "0.00",
      enableSorting: true,
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ getValue }) => (
        <Chip
          label={getValue()}
          color={getStatusColor(getValue())}
          size="small"
          variant="outlined"
        />
      ),
      enableSorting: false,
    },
    {
      header: "Date",
      accessorKey: "createdAt",
      cell: ({ getValue }) => new Date(getValue()).toLocaleDateString(),
      enableSorting: true,
    },
    {
      header: "Actions",
      id: "actions",
      cell: ({ row }) => (
        <Stack direction="row" spacing={1}>
          <Tooltip title="View Details">
            <IconButton
              size="small"
              color="info"
              onClick={() => navigate(`/purchases/${row.original.id}`)}
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton
              size="small"
              color="primary"
              onClick={() =>
                navigate(`/purchases/edit-purchase/${row.original.id}`)
              }
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Cancel Purchase">
            <IconButton
              size="small"
              color="error"
              onClick={() => console.log(row.original)}
            >
              <CancelIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];
};

export default usePurchaseColumns;
