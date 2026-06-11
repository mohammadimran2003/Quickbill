import { Box, Typography, Grid, Paper, Divider, Stack } from "@mui/material";
import {
  Inventory as InventoryIcon,
  Description as DescriptionIcon,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import getCategoryById from "../../api/categories_api/getCategoryById.js";
import InfoItem from "../../components/shared/InfoItem.jsx";
import DetailsStatCard from "../../components/shared/DetailsStatCard.jsx";
import DetailsPageHeader from "../../components/shared/DetailsPageHeader.jsx";

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
    <Box>
      {/* Header Section */}
      <DetailsPageHeader
        name={name}
        isActive={isActive}
        onEdit={() => navigate(`/categories/edit-category/${id}`)}
        editLabel="Category"
      />

      {/* Category Information */}
      <Box sx={{ mb: 3 }}>
        <Paper sx={{ p: 3, height: "100%" }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            Category Information
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {InfoItem(<DescriptionIcon />, "Description", description)}

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
