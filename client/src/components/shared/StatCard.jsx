import { Box, Card, Chip, Typography, useTheme } from "@mui/material";

// StatCard.jsx
const StatCard = ({ title, value, badgeText, icon, type = "order" }) => {
  const theme = useTheme();

  const colors = theme.palette.statCard[type];

  return (
    <Card
      sx={{
        p: 3,
        borderRadius: 3,
        boxShadow: "0px 4px 20px rgba(0,0,0,0.05)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        bgcolor: colors?.bg,
        color: colors?.color,
        "&:hover": {
          boxShadow: "0px 6px 25px rgba(0,0,0,0.1)",
        },
      }}
    >
      <Box>
        <Typography variant="subtitle2">{title}</Typography>
        <Typography variant="h5">{value}</Typography>
        {badgeText && (
          <Chip
            label={badgeText}
            sx={{ bgcolor: colors?.bg, color: colors?.color }}
          />
        )}
      </Box>
      <Box
        sx={{
          background: colors?.bg,
          color: colors?.color,
          p: 2,
          borderRadius: 2,
        }}
      >
        {icon}
      </Box>
    </Card>
  );
};

export default StatCard;
