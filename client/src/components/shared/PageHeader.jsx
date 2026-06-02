import { Box, Typography, Button } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";

const PageHeader = ({ title, btnText, onBtnClick, children }) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          color: "text.primary",
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={900}>
            {title}
          </Typography>
        </Box>

        {btnText && (
          <Button
            variant="contained"
            startIcon={<AddCircleIcon />}
            onClick={onBtnClick}
          >
            {btnText}
          </Button>
        )}
      </Box>

      {children && <Box sx={{ mt: 3 }}>{children}</Box>}
    </Box>
  );
};

export default PageHeader;
