import { Paper, Typography } from "@mui/material";

const DetailsStatCard = (label, value, color) => (
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

export default DetailsStatCard;
