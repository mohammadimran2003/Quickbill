import { Grid, Paper, Typography, Divider, Button } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import PurchaseInfoItem from "./purchaseInfoItem";
import { useNavigate } from "react-router-dom";

function SupplierInfo({ supplier }) {
  const navigate = useNavigate();
  return (
    <Grid size={{ xs: 12, md: 6 }}>
      <Paper sx={{ p: 3, height: "100%" }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
          Supplier Information
        </Typography>
        <Divider sx={{ mb: 2 }} />

        {supplier ? (
          <>
            {PurchaseInfoItem(<PersonIcon />, "Name", supplier.name)}
            {PurchaseInfoItem(<PhoneIcon />, "Phone", supplier.phone)}
            <Button
              variant="text"
              size="small"
              onClick={() => navigate(`/suppliers/${supplier.id}`)}
            >
              View Full Profile
            </Button>
          </>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Walk-in / No Supplier Selected
          </Typography>
        )}
      </Paper>
    </Grid>
  );
}

export default SupplierInfo;
