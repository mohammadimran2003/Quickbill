import { Grid, Box, Skeleton, Card } from "@mui/material";

const StatsSkeleton = ({ length = 4 }) => {
  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {Array.from({ length }).map((_, index) => (
        <Grid key={index} size={3}>
          <Card
            sx={{
              p: 2.5,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderRadius: 2,
              boxShadow: "none",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Box sx={{ flexGrow: 1 }}>
              <Skeleton variant="text" width="70%" height={20} sx={{ mb: 1 }} />

              <Skeleton variant="text" width="50%" height={36} />
            </Box>

            <Skeleton
              variant="circular"
              width={44}
              height={44}
              sx={{ ml: 2, flexShrink: 0 }}
            />
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default StatsSkeleton;
