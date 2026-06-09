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
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationOnIcon,
  History as HistoryIcon,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import getCustomerById from "../../api/customers_api/getCustomerById";
import RechargeWalletModal from "./RechargeWalletModal";
import { useMutation } from "@tanstack/react-query";
import CustomerModal from "../../components/customers_comp/CustomerModal";
import { toast } from "sonner";
import updateCustomer from "../../api/customers_api/updateCustomer";
import InfoItem from "../../components/shared/InfoItem";
import DetailsStatCard from "../../components/shared/DetailsStatCard";

const CustomerDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const [isRechargeModalOpen, setIsRechargeModalOpen] = useState(false);
  const { data: customerData } = useQuery({
    queryFn: () => getCustomerById(id),
    queryKey: ["customers"],
  });

  const { mutate: updateMutationCustomer } = useMutation({
    mutationFn: ({ id, data }) => updateCustomer({ id, data }),
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });

  // Jodi data load hote thake ba na thake
  if (!customerData)
    return <Typography>Loading customer details...</Typography>;

  const {
    name,
    email,
    customerType,
    isActive,
    phone,
    address,
    totalSpent,
    totalDue,
    walletBalance,
    creditLimit,
    note,
    createdAt,
  } = customerData.data;

  //handler
  const handleEditCustomer = () => {
    setIsModalOpen(true);
  };

  const handleSave = (formData) => {
    toast.promise(updateMutationCustomer({ id, data: formData }), {
      pending: "Updating customer...",
      success: (data) => {
        console.log(data);
        return "Customer updated successfully";
      },
      error: (err) => {
        console.log(err);
        return "Customer edit error";
      },
    });
    setIsModalOpen(false);
  };

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
              {name}
            </Typography>
            <Stack direction="row" spacing={1}>
              <Chip
                label={customerType}
                size="small"
                color={customerType === "WHOLESALE" ? "secondary" : "default"}
              />
              <Chip
                label={isActive ? "Active" : "Inactive"}
                size="small"
                color={isActive ? "success" : "error"}
                variant="outlined"
              />
            </Stack>
          </Box>
        </Stack>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={handleEditCustomer}
        >
          Edit Customer
        </Button>
      </Stack>

      <Grid container spacing={3}>
        {/* Contact Information & Wallet Actions */}
        <Grid size={3}>
          <Stack spacing={3} sx={{ height: "100%" }}>
            {/* Wallet Recharge Card */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                {name}
              </Typography>
              <Stack spacing={1.5} sx={{ mb: 2 }}>
                <Typography variant="body1">
                  <strong>Phone:</strong> {phone || "N/A"}
                </Typography>
                <Typography variant="body1">
                  <strong>Wallet:</strong> ৳
                  {walletBalance?.toLocaleString() || 0}
                </Typography>
                <Typography variant="body1" color="error">
                  <strong>Due:</strong> ৳{totalDue?.toLocaleString() || 0}
                </Typography>
              </Stack>
              <Divider sx={{ mb: 2 }} />
              <Button
                variant="outlined"
                color="primary"
                fullWidth
                onClick={() => setIsRechargeModalOpen(true)}
              >
                + Recharge Wallet
              </Button>
            </Paper>

            {/* Contact Info */}
            <Paper sx={{ p: 3, flex: 1 }}>
              <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                Contact Info
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {InfoItem(<PhoneIcon />, "Phone Number", phone)}
              {InfoItem(<EmailIcon />, "Email Address", email)}
              {InfoItem(<LocationOnIcon />, "Address", address)}

              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 2, display: "block" }}
              >
                Created At: {new Date(createdAt).toLocaleDateString()}
              </Typography>
            </Paper>
          </Stack>
        </Grid>

        {/* Financial Summary */}
        <Grid size={5}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              Financial Summary
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={2}>
              <Grid xs={6} sm={3}>
                {DetailsStatCard("Total Spent", totalSpent, "primary")}
              </Grid>
              <Grid xs={6} sm={3}>
                {DetailsStatCard("Total Due", totalDue, "error")}
              </Grid>
              <Grid xs={6} sm={3}>
                {DetailsStatCard("Wallet Balance", walletBalance, "success")}
              </Grid>
              <Grid xs={6} sm={3}>
                {DetailsStatCard("Credit Limit", creditLimit, "warning")}
              </Grid>
            </Grid>

            <Box sx={{ mt: 4 }}>
              <Typography
                variant="subtitle2"
                gutterBottom
                color="text.secondary"
              >
                Internal Note
              </Typography>
              <Paper
                variant="outlined"
                sx={{ p: 2, bgcolor: "grey.50", minHeight: "80px" }}
              >
                <Typography variant="body2">
                  {note || "No internal notes added for this customer."}
                </Typography>
              </Paper>
            </Box>
          </Paper>
        </Grid>

        {/* Placeholder for Transactions/Orders */}
        <Grid size={4}>
          <Paper sx={{ p: 3 }}>
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              <HistoryIcon color="action" />
              <Typography variant="h6">Recent Activity</Typography>
            </Stack>
            <Divider />
            <Box sx={{ py: 4, textAlign: "center" }}>
              <Typography color="text.secondary">
                Transaction history and Order list will be displayed here.
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Recharge Wallet Modal */}
      <RechargeWalletModal
        isRechargeModalOpen={isRechargeModalOpen}
        setIsRechargeModalOpen={setIsRechargeModalOpen}
        walletBalance={walletBalance}
        totalDue={totalDue}
        id={id}
      />

      {isModalOpen && (
        <CustomerModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          initialData={customerData.data}
        />
      )}
    </Box>
  );
};

export default CustomerDetailsPage;
