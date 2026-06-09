import { Card, CardContent, Box, Skeleton, Stack } from "@mui/material";

const ProductSkeleton = () => {
  return (
    <Card
      elevation={2}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      <Skeleton
        variant="rectangular"
        height={140}
        sx={{ bgcolor: "grey.200" }}
      />

      <CardContent sx={{ flexGrow: 1, p: 2, pb: 1 }}>
        <Skeleton variant="text" width="40%" height={20} sx={{ mb: 1 }} />

        <Skeleton variant="text" width="90%" height={24} sx={{ mb: 0.5 }} />
        <Skeleton variant="text" width="60%" height={24} sx={{ mb: 2 }} />

        <Stack direction="row" spacing={1}>
          <Skeleton variant="text" width="30%" height={30} />
        </Stack>
      </CardContent>

      <Box sx={{ p: 1.5, pt: 0 }}>
        <Skeleton
          variant="rectangular"
          height={36}
          sx={{ borderRadius: 1.5 }}
        />
      </Box>
    </Card>
  );
};

export default ProductSkeleton;
