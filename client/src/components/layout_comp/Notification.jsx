import { useState } from "react";
import {
  Badge,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Typography,
  Divider,
  Button,
} from "@mui/material";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import { useTheme } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getLowStock } from "../../api/products_api/getLowStock.js";

function Notification() {
  const theme = useTheme();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const { data } = useQuery({
    queryKey: ["lowStock"],
    queryFn: getLowStock,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const lowStockProducts = data?.data || [];

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleViewAll = () => {
    handleClose();
    navigate("/products?stockStatus=low");
  };

  return (
    <>
      <Badge badgeContent={lowStockProducts.length} color="error">
        <IconButton
          onClick={handleClick}
          sx={{
            bgcolor: theme.palette.background.paper,
            boxShadow: 1,
            "&:hover": { bgcolor: theme.palette.background.default },
          }}
        >
          <NotificationsNoneOutlinedIcon />
        </IconButton>
      </Badge>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            sx: {
              width: 280,
              maxHeight: 400,
              boxShadow: 3,
              borderRadius: 2,
              mt: 1.5,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Box
          sx={{ display: "flex", alignItems: "center", gap: 1, px: 2, py: 1.5 }}
        >
          <WarningAmberRoundedIcon color="warning" size="small" />
          <Typography variant="subtitle2" fontWeight="700" color="warning.main">
            Low Stock Alert
          </Typography>
        </Box>

        <Divider />

        {lowStockProducts.length === 0 ? (
          <Box sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              All products are sufficiently stocked! 👍
            </Typography>
          </Box>
        ) : (
          <Box sx={{ maxHeight: 250, overflowY: "auto" }}>
            {lowStockProducts.map((product) => (
              <MenuItem
                key={product.id}
                onClick={handleClose}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  py: 1,
                  px: 2,
                }}
              >
                <Typography
                  variant="body2"
                  fontWeight="500"
                  sx={{ maxWidth: 160, noWrap: true }}
                >
                  {product.name}
                </Typography>
                <Typography
                  variant="caption"
                  fontWeight="600"
                  sx={{
                    color: product.stock === 0 ? "error.main" : "warning.main",
                    bgcolor:
                      product.stock === 0 ? "error.lighter" : "warning.lighter",
                    px: 1,
                    py: 0.2,
                    borderRadius: 1,
                  }}
                >
                  Stock: {product.stock}
                </Typography>
              </MenuItem>
            ))}
          </Box>
        )}

        <Divider />
        <Box sx={{ p: 0.5, display: "flex", justifyContent: "center" }}>
          <Button
            fullWidth
            size="small"
            onClick={handleViewAll}
            sx={{ fontWeight: "600", textTransform: "none" }}
          >
            View All
          </Button>
        </Box>
      </Menu>
    </>
  );
}

export default Notification;
