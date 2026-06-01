import { Box, Card, Chip, Typography } from "@mui/material";

// StatCard.jsx
const StatCard = ({
  title,
  value,
  badgeText,
  icon,
  color,
  bgColor,
  borderColor,
}) => {
  return (
    <Card
      sx={{
        p: 3,
        borderRadius: 3,
        boxShadow: "0px 4px 20px rgba(0,0,0,0.05)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        border: `1px solid ${borderColor}`,
        "&:hover": {
          boxShadow: "0px 6px 25px rgba(0,0,0,0.1)",
        },
      }}
    >
      <Box>
        <Typography variant="subtitle2">{title}</Typography>
        <Typography variant="h5">{value}</Typography>
        {badgeText && (
          <Chip label={badgeText} sx={{ bgcolor: bgColor, color: color }} />
        )}
      </Box>
      <Box sx={{ background: bgColor, color: color, p: 2, borderRadius: 2 }}>
        {icon}
      </Box>
    </Card>
  );
};

export default StatCard;
