import { Box, Typography } from "@mui/material";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import ChevronLeftOutlinedIcon from "@mui/icons-material/ChevronLeftOutlined";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import { IconButton } from "@mui/material";
import { useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";

function SidebarHeader({ sidebarOpen, toggleSidebar }) {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/dashboard");
  };

  return (
    <Box
      sx={{
        zIndex: 900,
        position: "sticky",
        backgroundColor: theme.palette.background.paper,
        top: 0,
        px: sidebarOpen ? 3 : 0,
        py: 3,
        display: "flex",
        alignItems: "center",
        justifyContent: sidebarOpen ? "space-between" : "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.25,
          cursor: "pointer",
        }}
        onClick={handleNavigate}
      >
        <Inventory2Icon
          sx={{ fontSize: 32, color: theme.palette.primary.main }}
        />
        {sidebarOpen && (
          <Typography variant="h6" fontWeight={700} color="text.primary">
            Quickbill
          </Typography>
        )}
      </Box>
      <IconButton
        onClick={toggleSidebar}
        sx={{
          position: "fixed",
          left: sidebarOpen ? 260 - 16 : 72 - 16,
          top: 20,
          zIndex: 1000,

          bgcolor: "#fff",
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: 1,
          width: 32,
          height: 32,
        }}
      >
        {sidebarOpen ? (
          <ChevronLeftOutlinedIcon />
        ) : (
          <ChevronRightOutlinedIcon />
        )}
      </IconButton>
    </Box>
  );
}

export default SidebarHeader;
