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
  Description as DescriptionIcon,
  Image as ImageIcon,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import getBrandById from "../../api/brands_api/getBrandById";
import DetailsStatCard from "../../components/shared/DetailsStatCard";
import InfoItem from "../../components/shared/InfoItem";
import DetailsPageHeader from "../../components/shared/DetailsPageHeader.jsx";

const BrandDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: brandData } = useQuery({
    queryFn: () => getBrandById(id),
    queryKey: ["brands", id],
  });

  // Jodi data load hote thake ba na thake
  if (!brandData) return <Typography>Loading brand details...</Typography>;

  const { name, description, logo, isActive, createdAt, _count } =
    brandData.data;

  return (
    <Box>
      <DetailsPageHeader
        name={name}
        isActive={isActive}
        onEdit={() => navigate(`/brands/edit-brand/${id}`)}
        editLabel="Brand"
      />
      {/* Brand Information */}
      <Box>
        <Paper sx={{ p: 3, mb: 4, height: "100%" }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            Brand Information
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {InfoItem(<DescriptionIcon />, "Description", description)}

          {logo && (
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                sx={{ mb: 1 }}
              >
                Logo
              </Typography>
              <Box
                component="img"
                src={logo}
                alt={`${name} logo`}
                sx={{
                  maxWidth: "100px",
                  maxHeight: "100px",
                  borderRadius: 1,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              />
            </Box>
          )}

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 2, display: "block" }}
          >
            Created At: {new Date(createdAt).toLocaleDateString()}
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
                  "Total Products",
                  _count?.products || 0,
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

        {/* Associated Products */}
        <Grid size={5}>
          <Paper sx={{ p: 3 }}>
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              <InventoryIcon color="action" />
              <Typography variant="h6">Associated Products</Typography>
            </Stack>
            <Divider />
            <Box sx={{ py: 4, textAlign: "center" }}>
              <Typography color="text.secondary">
                Product list associated with this brand will be displayed here.
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BrandDetailsPage;
