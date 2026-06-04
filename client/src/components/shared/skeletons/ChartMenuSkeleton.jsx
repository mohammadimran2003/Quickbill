import { Box, Skeleton, Paper, Tabs, Tab } from "@mui/material";

const ChartMenuSkeleton = () => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 4,
        border: "1px solid",
        borderColor: "divider",
        width: "100%",
      }}
    >
      {/* Header Section */}

      {/* Chart Content Skeleton */}
      <Box sx={{ pt: 3 }}>
        <Skeleton
          variant="rectangular"
          width="100%"
          height={300}
          sx={{ borderRadius: 2 }}
        />
      </Box>
    </Paper>
  );
};

export default ChartMenuSkeleton;
