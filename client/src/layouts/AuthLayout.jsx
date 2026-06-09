import { Box, useTheme } from "@mui/material";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.palette.background.default,
        px: 2,
        py: 4,
        maxWidth: 1600,
      }}
    >
      <Outlet />
    </Box>
  );
};

export default AuthLayout;
