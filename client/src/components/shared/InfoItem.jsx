import { Box, Stack, Typography } from "@mui/material";

const InfoItem = (icon, label, value) => (
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

export default InfoItem;
