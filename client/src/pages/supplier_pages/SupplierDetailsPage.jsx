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
  Inventory as InventoryIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationOnIcon,
  Note as NoteIcon,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import getSupplierById from "../../api/suppliers_api/getSupplierById";
import InfoItem from "../../components/shared/InfoItem";
import DetailsStatCard from "../../components/shared/DetailsStatCard";
import DetailsPageHeader from "../../components/shared/DetailsPageHeader.jsx";

const SupplierDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: supplierData } = useQuery({
    queryFn: () => getSupplierById(id),
    queryKey: ["supplier", id],
  });

  if (!supplierData)
    return <Typography>Loading supplier details...</Typography>;

  const { name, phone, email, address, note, isActive, createdAt, _count } =
    supplierData.data;

  return (
    <Box>
      {/* Header Section */}
      <DetailsPageHeader
        name={name}
        isActive={isActive ? "Active" : "Inactive"}
        onEdit={() => navigate(`/suppliers/edit-supplier/${id}`)}
      />
      {/* Supplier Information */}
      <Box sx={{ mb: 3 }}>
        <Paper sx={{ p: 3, height: "100%" }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            Supplier Information
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {InfoItem(<PhoneIcon />, "Phone", phone)}
          {InfoItem(<EmailIcon />, "Email", email)}
          {InfoItem(<LocationOnIcon />, "Address", address)}
          {InfoItem(<NoteIcon />, "Note", note)}

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 2, display: "block" }}
          >
            Created At:{" "}
            {createdAt ? new Date(createdAt).toLocaleDateString() : "N/A"}
          </Typography>
        </Paper>
      </Box>
      <Grid container spacing={3}>
        {/* Statistics */}
        <Grid size={7}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              Statistics
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={2}>
              <Grid xs={12} sm={6}>
                {DetailsStatCard(
                  "Total Purchases",
                  _count?.purchases || 0,
                  "primary",
                )}
              </Grid>
              <Grid xs={12} sm={6}>
                {DetailsStatCard(
                  "Status",
                  isActive ? "Active" : "Inactive",
                  isActive ? "success" : "error",
                )}
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Associated Purchases */}
        <Grid size={5}>
          <Paper sx={{ p: 3 }}>
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              <InventoryIcon color="action" />
              <Typography variant="h6">Recent Purchases</Typography>
            </Stack>
            <Divider />
            <Box sx={{ py: 4, textAlign: "center" }}>
              <Typography color="text.secondary">
                Purchase history from this supplier will be displayed here.
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SupplierDetailsPage;
