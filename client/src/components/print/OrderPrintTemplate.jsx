import React from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  Stack,
  Grid,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import getStore from "../../api/stores_api/getStore";
import PrintHeader from "../shared/PrintHeader";
import PrintFooter from "../shared/PrintFooter";
import useFmt from "../../hooks/useFmt";

export const OrderPrintTemplate = React.forwardRef(({ order }, ref) => {
  const { data: storeData } = useQuery({
    queryKey: ["store"],
    queryFn: () => getStore(),
  });
  const fmt = useFmt();

  if (!order) return null;

  const { name, address, phone, receiptFooter, binNumber } =
    storeData?.data || {};

  const {
    orderNumber,
    customerName,
    customerId,
    createdAt,
    subtotal,
    discountAmount,
    taxAmount,
    total,
    amountPaid,
    dueAmount,
    paymentMethod,
  } = order;

  return (
    <Box ref={ref} sx={{ p: 4, bgcolor: "white", color: "black" }}>
      {/* Header */}
      <PrintHeader
        name={name}
        address={address}
        phone={phone}
        orderNumber={orderNumber}
      />
      <Divider sx={{ mb: 3 }} />

      {/* Customer & Order Info */}
      <Grid
        container
        spacing={2}
        sx={{ mb: 4, display: "flex", justifyContent: "space-between" }}
      >
        <Grid>
          <Typography variant="subtitle2" color="textSecondary">
            Bill To:
          </Typography>
          <Typography variant="body1" fontWeight="bold">
            {customerName || "Walk-in Customer"}
          </Typography>
          <Typography variant="body2">
            Customer ID: {customerId || "N/A"}
          </Typography>
        </Grid>
        <Grid sx={{ textAlign: "right" }}>
          <Typography variant="subtitle2" color="textSecondary">
            Date:
          </Typography>
          <Typography variant="body1">
            {new Date(createdAt).toLocaleDateString("en-GB")}
          </Typography>
          <Typography variant="subtitle2" color="textSecondary" sx={{ mt: 1 }}>
            Payment Method:
          </Typography>
          <Typography variant="body1">{paymentMethod}</Typography>
        </Grid>
      </Grid>

      {/* Items Table */}
      <TableContainer sx={{ mb: 4 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell
                sx={{ fontWeight: "bold", borderBottom: "2px solid black" }}
              >
                Product
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", borderBottom: "2px solid black" }}
              >
                Qty
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", borderBottom: "2px solid black" }}
              >
                Price
              </TableCell>
              <TableCell
                align="right"
                sx={{ fontWeight: "bold", borderBottom: "2px solid black" }}
              >
                Total
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {order?.items?.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.productName}</TableCell>
                <TableCell align="center">{item.quantity}</TableCell>
                <TableCell align="center">{fmt(item.unitPrice)}</TableCell>
                <TableCell align="right">{fmt(item.total)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Summary */}
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Stack spacing={1} sx={{ width: "250px" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography>Subtotal:</Typography>
            <Typography>{fmt(subtotal || 0)}</Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography>Discount:</Typography>
            <Typography>- {fmt(discountAmount)}</Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography>Tax:</Typography>
            <Typography>+ {fmt(taxAmount)}</Typography>
          </Box>
          <Divider />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6" fontWeight="bold">
              Total:
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              {fmt(total)}
            </Typography>
          </Box>
          <Divider />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2">Paid:</Typography>
            <Typography variant="body2">{fmt(amountPaid)}</Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2">Due:</Typography>
            <Typography
              variant="body2"
              color={dueAmount > 0 ? "error" : "inherit"}
            >
              {fmt(dueAmount)}
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* Footer */}
      <PrintFooter receiptFooter={receiptFooter} binNumber={binNumber} />
    </Box>
  );
});
