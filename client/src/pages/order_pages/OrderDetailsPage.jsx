import React, { useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Stack,
  CircularProgress,
} from "@mui/material";
import getOrderById from "../../api/orders_api/getOrderById";
import { OrderPrintTemplate } from "../../components/print/OrderPrintTemplate";
import OrderHeader from "../../components/orders_comp/OrderHeader";
import OrderItemsTable from "../../components/orders_comp/OrderItemsTable";
import OrderSummary from "../../components/orders_comp/OrderSummary";
import ReturnDialog from "../../components/orders_comp/ReturnDialog";
import createReturn from "../../api/returns_api/createReturn";
import { toast } from "sonner";

const OrderDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const printRef = useRef();
  const queryClient = useQueryClient();
  const [returnDialogOpen, setReturnDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["order", id],
    queryFn: () => getOrderById(id),
  });
  const order = data?.data;
  console.log(data, "data");

  const returnMutation = useMutation({
    mutationFn: createReturn,
    onSuccess: () => {
      queryClient.invalidateQueries(["order", id]);
    },
    onError: (error) => {
      console.log(error?.response?.data?.message, "return error");
    },
  });

  const handleReturnItem = (item) => {
    setSelectedItem(item);
    setReturnDialogOpen(true);
  };

  const handleConfirmReturn = (returnData) => {
    toast.promise(returnMutation.mutateAsync(returnData), {
      loading: "Processing return...",
      success: (data) =>
        data?.data?.message || "Return processed successfully!",
      error: (err) => err?.response?.data?.message || "Error processing return",
    });
  };

  if (isLoading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );

  if (isError)
    return <Typography color="error">Error: {error.message}</Typography>;

  return (
    <Container maxWidth={false} sx={{ maxWidth: 1400, py: 4 }}>
      <OrderHeader
        order={order}
        onEdit={() => navigate(`/orders/edit/${id}`)}
        printRef={printRef}
      />

      <Grid container spacing={3}>
        {/* Left Side: Order Items Table */}
        <Grid size={8}>
          <OrderItemsTable order={order} onReturnItem={handleReturnItem} />

          {order?.note && (
            <Paper
              elevation={0}
              sx={{
                p: 2,
                mt: 3,
                bgcolor: "grey.50",
                border: "1px dashed grey",
              }}
            >
              <Typography variant="subtitle2" fontWeight="bold">
                Note:
              </Typography>
              <Typography variant="body2">{order.note}</Typography>
            </Paper>
          )}
        </Grid>

        {/* Right Side: Order Summary & Customer Info */}
        <Grid size={4}>
          <OrderSummary order={order} />
        </Grid>
      </Grid>

      <Box sx={{ display: "none" }}>
        <OrderPrintTemplate ref={printRef} order={order} />
      </Box>

      <ReturnDialog
        open={returnDialogOpen}
        onClose={() => setReturnDialogOpen(false)}
        item={selectedItem}
        order={order}
        onConfirm={handleConfirmReturn}
      />
    </Container>
  );
};

export default OrderDetailsPage;
