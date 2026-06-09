import { Box, Badge, IconButton } from "@mui/material";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import UserProfile from "../profile/UserProfile";
import { useTheme } from "@mui/material";
import { Outlet } from "react-router-dom";
import Notification from "./Notification";
import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";

function LayoutHeader() {
  const theme = useTheme();
  const { mode, toggleMode } = useContext(ThemeContext);

  return (
    <Box
      sx={{
        position: "relative",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        zIndex: 200,
        overflowY: "auto",
        "&::-webkit-scrollbar": {
          width: 6,
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#ccc",
          borderRadius: 10,
        },
        "&::-webkit-scrollbar-thumb:hover": {
          backgroundColor: "#999",
        },
      }}
    >
      <Box
        sx={{
          px: 4,
          py: 2,
          position: "sticky",
          top: 0,
          zIndex: 100,
          backgroundColor:
            theme.palette.mode === "dark"
              ? "rgba(33, 43, 54, 0.8)"
              : "rgba(255,255,255,0.5)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",

          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,

            flexWrap: "wrap",
          }}
        >
          <Box></Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton
              onClick={toggleMode}
              sx={{
                bgcolor: theme.palette.background.paper,
                "&:hover": {
                  bgcolor: theme.palette.action.hover,
                },
              }}
            >
              {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
            <Notification />
            <UserProfile />
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          flex: 1,
          width: "100%",
          maxWidth: theme.layout.maxWidth,
          mx: "auto",
          p: 4,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}

export default LayoutHeader;
