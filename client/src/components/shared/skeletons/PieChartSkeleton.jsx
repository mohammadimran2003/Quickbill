import { Paper, Box, Skeleton } from "@mui/material";

const PieChartSkeleton = () => {
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
      <Box sx={{ mb: 3 }}>
        <Skeleton variant="text" width="40%" height={32} sx={{ mb: 0.5 }} />

        <Skeleton variant="text" width="55%" height={20} />
      </Box>

      <Box
        sx={{
          width: "100%",
          height: 350,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Skeleton
          variant="circular"
          width={200}
          height={200}
          sx={{ mb: 4, animationDuration: "1.5s" }}
        />

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 3,
            width: "100%",
          }}
        >
          {Array.from({ length: 3 }).map((_, index) => (
            <Box
              key={index}
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <Skeleton variant="circular" width={12} height={12} />

              <Skeleton variant="text" width={60} height={18} />
            </Box>
          ))}
        </Box>
      </Box>
    </Paper>
  );
};

export default PieChartSkeleton;
