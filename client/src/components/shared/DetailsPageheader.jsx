import {
  Stack,
  IconButton,
  Typography,
  Box,
  Chip,
  Button,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
} from "@mui/icons-material";

function DetailsPageHeader({ name, isActive, onEdit, editLabel }) {
  return (
    <Stack
      direction="row"
      sx={{
        mb: 3,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Stack direction="row" spacing={2}>
        <IconButton onClick={() => navigate(-1)} color="primary">
          <ArrowBackIcon />
        </IconButton>
        <Box>
          <Typography variant="h5" fontWeight="bold">
            {name}
          </Typography>
          <Stack direction="row" spacing={1}>
            <Chip
              label={isActive ? "Active" : "Inactive"}
              size="small"
              color={isActive ? "success" : "error"}
              variant="outlined"
            />
          </Stack>
        </Box>
      </Stack>
      <Button variant="contained" startIcon={<EditIcon />} onClick={onEdit}>
        {`Edit ${editLabel}` || `Edit ${name}`}
      </Button>
    </Stack>
  );
}

export default DetailsPageHeader;
