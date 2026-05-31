import { Stack, Typography, Box } from "@mui/material";

function PrintHeader({ name, address, phone, orderNumber }) {
  return (
    <Stack
      sx={{
        mb: 4,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Box>
        <Typography variant="h4" fontWeight="bold">
          INVOICE
        </Typography>
        <Typography variant="body1">Order #{orderNumber}</Typography>
      </Box>
      <Box sx={{ textAlign: "center" }}>
        <Typography variant="h6" fontWeight="bold">
          {name}
        </Typography>
        <Typography variant="body2">{address}</Typography>
        <Typography variant="body2">Phone: {phone}</Typography>
      </Box>
    </Stack>
  );
}

export default PrintHeader;
