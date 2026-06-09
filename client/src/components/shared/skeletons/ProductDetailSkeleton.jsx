import {
  Box,
  Card,
  Divider,
  Grid,
  Paper,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";

function ProductDetailSkeleton() {
  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Main Content Grid */}
      <Grid container spacing={3} sx={{ mt: 4 }}>
        {/* Left Column: Image & Pricing Summary (Size 4) */}
        <Grid size={4}>
          {/* Product Image Skeleton */}
          <Card sx={{ mb: 3, borderRadius: 2 }}>
            <Skeleton variant="rectangular" height={400} />
          </Card>

          {/* Pricing Summary Paper */}
          <Paper sx={{ p: 2, borderRadius: 2 }}>
            <Skeleton variant="text" width="50%" height={28} sx={{ mb: 1 }} />
            <Divider sx={{ mb: 2 }} />
            <Stack spacing={1.5}>
              {[...Array(3)].map((_, index) => (
                <Box
                  key={index}
                  sx={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Skeleton variant="text" width="30%" />
                  <Skeleton variant="text" width="20%" />
                </Box>
              ))}
              <Divider />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Skeleton variant="text" width="45%" height={24} />
                <Skeleton variant="text" width="25%" height={32} />
              </Box>
            </Stack>
          </Paper>
        </Grid>

        {/* Right Column: Detailed Info (Size 8) */}
        <Grid size={8}>
          {/* 1. Product Specifications Paper */}
          <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
            <Skeleton variant="text" width="30%" height={32} sx={{ mb: 2 }} />
            <TableContainer sx={{ width: "100%" }}>
              <Table size="small">
                <TableBody>
                  {[...Array(5)].map((_, index) => (
                    <TableRow key={index}>
                      <TableCell sx={{ width: "40%", py: 1.5 }}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Skeleton variant="circular" width={20} height={20} />
                          <Skeleton variant="text" width="60%" />
                        </Box>
                      </TableCell>
                      <TableCell sx={{ py: 1.5 }}>
                        <Skeleton variant="text" width="40%" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {/* 2. Description Paper */}
          <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
            <Skeleton variant="text" width="20%" height={32} sx={{ mb: 1.5 }} />
            <Stack spacing={1}>
              <Skeleton variant="text" width="100%" />
              <Skeleton variant="text" width="95%" />
              <Skeleton variant="text" width="60%" />
            </Stack>
          </Paper>

          {/* 3. Tags & Metadata Paper */}
          <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
            <Skeleton variant="text" width="25%" height={32} sx={{ mb: 1.5 }} />
            <Box sx={{ display: "flex", gap: 1 }}>
              <Skeleton variant="rounded" width={70} height={24} />
              <Skeleton variant="rounded" width={85} height={24} />
              <Skeleton variant="rounded" width={65} height={24} />
            </Box>
          </Paper>

          {/* 4. Barcode Paper */}
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Skeleton variant="text" width="15%" height={32} sx={{ mb: 1.5 }} />
            {/* Barcode Image Placeholder */}
            <Skeleton variant="rectangular" width={200} height={60} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ProductDetailSkeleton;
