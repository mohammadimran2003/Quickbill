import { useState } from "react";
import { useTheme } from "@emotion/react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  Typography,
} from "@mui/material";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import useAuth from "../../hooks/useAuth.js";

function UserProfile() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleOpen = () => setDrawerOpen(true);
  const handleClose = () => setDrawerOpen(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <>
      <Box
        onClick={handleOpen}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          px: 2,
          py: 1,
          bgcolor: "background.default",
          borderRadius: 3,
          boxShadow: 1,
          cursor: "pointer",
          "&:hover": {
            bgcolor: theme.palette.action.hover,
          },
        }}
      >
        <Avatar
          sx={{
            width: 40,
            height: 40,
            bgcolor: "primary.main",
            color: "texxt.primary",
          }}
        >
          {user?.name?.charAt(0) ?? "U"}
        </Avatar>
        <Box sx={{ color: "text.primary" }}>
          <Typography variant="subtitle2" fontWeight={700}>
            {user?.name || "User"}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Role: {user?.role || "N/A"}
          </Typography>
        </Box>
      </Box>

      <Drawer anchor="right" open={drawerOpen} onClose={handleClose}>
        <Box
          sx={{
            width: 320,
            p: 3,
            minHeight: "100%",
            bgcolor: theme.palette.background.default,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
            <Avatar
              sx={{
                width: 56,
                height: 56,
                bgcolor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
              }}
            >
              {user?.name?.charAt(0) ?? "U"}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" fontWeight={700}>
                {user?.name || "User"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.email || "No email"}
              </Typography>
            </Box>
          </Box>
          <Divider sx={{ mb: 3 }} />
          <Box sx={{ display: "grid", gap: 2, mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
              <PersonOutlineOutlinedIcon color="primary" fontSize="small" />
              <Box>
                <Typography variant="body2" fontWeight={700}>
                  {user?.name || "Unknown"}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Full name
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
              <EmailOutlinedIcon color="primary" fontSize="small" />
              <Box>
                <Typography variant="body2" fontWeight={700}>
                  {user?.email || "No email"}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Email address
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
              <ShieldOutlinedIcon color="primary" fontSize="small" />
              <Box>
                <Typography variant="body2" fontWeight={700}>
                  {user?.role || "N/A"}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Account role
                </Typography>
              </Box>
            </Box>
          </Box>
          <Button
            variant="contained"
            color="error"
            fullWidth
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
      </Drawer>
    </>
  );
}

export default UserProfile;
