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
import getCategoryById from "../../api/categories_api/getCategoryById";
const infoItem = (icon, label, value) => (
  <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
    <Box sx={{ color: "primary.main", display: "flex" }}>{icon}</Box>
    <Box>
      <Typography variant="caption" color="text.secondary" display="block">
        {label}
      </Typography>
      <Typography variant="body1" fontWeight={500}>
        {value || "N/A"}
      </Typography>
    </Box>
  </Stack>
);

const statCard = (label, value, color) => (
  <Paper
    variant="outlined"
    sx={{
      p: 2,
      textAlign: "center",
      bgcolor: `${color}.50`,
      borderColor: `${color}.200`,
    }}
  >
    <Typography variant="caption" color="text.secondary" gutterBottom>
      {label}
    </Typography>
    <Typography variant="h6" color={`${color}.main`} fontWeight="bold">
      {value}
    </Typography>
  </Paper>
);
const CategoryDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: categoryData } = useQuery({
    queryFn: () => getCategoryById(id),
    queryKey: ["categories", id],
  });

  // Jodi data load hote thake ba na thake
  if (!categoryData)
    return <Typography>Loading category details...</Typography>;

  const { name, description, image, isActive, createdAt, _count } =
    categoryData.data;

  return (
    <Box sx={{ p: 3, maxWidth: 1400, mx: "auto" }}>
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
          onClick={() => navigate(`/categories/edit/${id}`)}
        >
          Edit Category
        </Button>
      </Stack>

      <Grid container spacing={3}>
        {/* Category Information */}
        <Grid size={3}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              Category Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {infoItem(<DescriptionIcon />, "Description", description)}

            {image && (
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                  sx={{ mb: 1 }}
                >
                  Image
                </Typography>
                <Box
                  component="img"
                  src={image}
                  alt={`${name} image`}
                  sx={{
                    maxWidth: "150px",
                    maxHeight: "150px",
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
        </Grid>

        {/* Statistics */}
        <Grid size={5}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              Statistics
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={2}>
              <Grid xs={12} sm={6}>
                {statCard("Total Products", _count?.products || 0, "primary")}
              </Grid>
              <Grid xs={12} sm={6}>
                {statCard(
                  "Status",
                  isActive ? "Active" : "Inactive",
                  isActive ? "success" : "error",
                )}
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Associated Products */}
        <Grid size={4}>
          <Paper sx={{ p: 3 }}>
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              <InventoryIcon color="action" />
              <Typography variant="h6">Associated Products</Typography>
            </Stack>
            <Divider />
            <Box sx={{ py: 4, textAlign: "center" }}>
              <Typography color="text.secondary">
                Product list associated with this category will be displayed
                here.
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CategoryDetailsPage;
