import {
  Box,
  Typography,
  Grid,
  Paper,
  Divider,
  Chip,
  Stack,
  IconButton,
  Button,
  CircularProgress,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Receipt as ReceiptIcon,
  Payment as PaymentIcon,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import getPurchaseById from "../../api/purchases_api/getPurchaseById";
import ReturnDialog from "../../components/orders_comp/ReturnDialog";
import PurchaseItemsTable from "../../components/purchases_comp/PurchaseItemsTable";
import createReturn from "../../api/returns_api/createReturn";
import { toast } from "sonner";
import getStatusColor from "../../utils/getStatusColor";
import PurchaseInfoItem from "../../components/purchases_comp/purchaseInfoItem";
import PaymentSummary from "../../components/purchases_comp/PaymentSummary";
import SupplierInfo from "../../components/purchases_comp/SupplierInfo";

const PurchaseDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [returnDialogOpen, setReturnDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const { data: purchaseData, isLoading } = useQuery({
    queryFn: () => getPurchaseById(id),
    queryKey: ["purchase", id],
  });

  const returnMutation = useMutation({
    mutationFn: createReturn,
    onSuccess: () => {
      queryClient.invalidateQueries(["purchase", id]);
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
    console.log(returnData, "return dat");

    toast.promise(returnMutation.mutateAsync(returnData), {
      loading: "Processing return...",
      success: (data) =>
        data?.data?.message || "Return processed successfully!",
      error: (err) => err?.response?.data?.message || "Error processing return",
    });
  };

  if (isLoading)
    return (
      <Box sx={{ p: 3 }}>
        <CircularProgress />
      </Box>
    );
  if (!purchaseData || !purchaseData.data)
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Purchase not found...</Typography>
      </Box>
    );

  const purchase = purchaseData.data;

  const {
    purchaseNumber,
    supplier,

    subTotal,
    total,
    paidAmount,
    dueAmount,
    status,
    paymentMethod,
    note,
    createdAt,
  } = purchase;

  return (
    <Box>
      {/* Header Section */}
      <Stack
        direction="row"
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Stack direction="row" spacing={2}>
          <IconButton onClick={() => navigate(-1)} color="primary">
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Typography variant="h5" fontWeight="bold">
              {purchaseNumber}
            </Typography>
            <Stack direction="row" spacing={1}>
              <Chip
                label={status}
                size="small"
                color={getStatusColor(status)}
                variant="outlined"
              />
              <Chip
                label={paymentMethod}
                size="small"
                color="secondary"
                variant="outlined"
              />
            </Stack>
          </Box>
        </Stack>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={() => navigate(`/purchases/edit-purchase/${id}`)}
        >
          Edit Purchase
        </Button>
      </Stack>

      <Grid container spacing={3}>
        {/* Supplier Information */}

        <SupplierInfo supplier={supplier} />

        {/* Purchase Summary */}
        <PaymentSummary
          subTotal={subTotal}
          total={total}
          paidAmount={paidAmount}
          dueAmount={dueAmount}
          createdAt={createdAt}
        />

        {/* Note */}
        {note && (
          <Grid size={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Note
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body2">{note}</Typography>
            </Paper>
          </Grid>
        )}

        {/* Purchase Items */}
        <Grid size={12}>
          <PurchaseItemsTable
            purchase={purchase}
            onReturnItem={handleReturnItem}
          />
        </Grid>
      </Grid>

      <ReturnDialog
        open={returnDialogOpen}
        onClose={() => setReturnDialogOpen(false)}
        item={selectedItem}
        purchase={purchase}
        onConfirm={handleConfirmReturn}
      />
    </Box>
  );
};

export default PurchaseDetailsPage;
