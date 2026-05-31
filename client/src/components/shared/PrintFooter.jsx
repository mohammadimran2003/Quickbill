import { Box, Typography } from "@mui/material";

function PrintFooter({ receiptFooter, binNumber }) {
  return (
    <Box
      sx={{ mt: 8, textAlign: "center", borderTop: "1px solid #eee", pt: 2 }}
    >
      <Typography variant="body2" color="textSecondary">
        {receiptFooter}
      </Typography>
      <Typography variant="body2" color="textSecondary">
        {binNumber ? `BIN: ${binNumber}` : ""}
      </Typography>
    </Box>
  );
}

export default PrintFooter;
