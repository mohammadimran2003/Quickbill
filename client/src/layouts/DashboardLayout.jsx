import { useRef, useState } from "react";
import { Box, useTheme } from "@mui/material";

import SidebarHeader from "../components/layout_comp/SidebarHeader.jsx";
import LayoutHeader from "../components/layout_comp/LayoutHeader.jsx";
import SidebarMenus from "../components/layout_comp/SidebarMenus.jsx";

function DashboardLayout() {
  const theme = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openMenus, setOpenMenus] = useState({});
  const [hoverSubmenu, setHoverSubmenu] = useState(null);
  const [hoverCoords, setHoverCoords] = useState({ top: 0, left: 0 });

  const timerRef = useRef(null);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const getMenuKey = (item) => item.id || item.path || item.label;

  const toggleMenu = (item) => {
    const key = getMenuKey(item);
    setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleHoverMenu = (event, item) => {
    if (!sidebarOpen && item.subitems?.length) {
      // PROTHOM KAJ: Agey jodi kono "hide" timer thake sheta cancel kora
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      const rect = event.currentTarget.getBoundingClientRect();
      setHoverCoords({ top: rect.top, left: rect.right });
      setHoverSubmenu({ ...item, id: getMenuKey(item) });
    } else {
      // Jodi emon item hoy jar sub-menu nai, tobe hide kora
      handleLeaveMenu();
    }
  };

  const handleLeaveMenu = () => {
    if (!sidebarOpen) {
      // Agey jodi kono timer thake sheta clear kore notun timer set kora
      if (timerRef.current) clearTimeout(timerRef.current);

      timerRef.current = setTimeout(() => {
        setHoverSubmenu(null);
        timerRef.current = null;
      }, 300); // 300ms delay
    }
  };

  // Sub-menu (Paper) er bhitore mouse thakle jeno bondho na hoy
  const clearHoverTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        backgroundColor: theme.palette.background.default,
      }}
    >
      {/* sidebar */}
      <Box
        sx={{
          position: "relative",
          width: sidebarOpen ? 260 : 72,
          minWidth: sidebarOpen ? 260 : 72,
          height: "100vh",
          backgroundColor: theme.palette.background.paper,
          borderRight: `1px solid ${theme.palette.divider}`,
          transition: "width 200ms ease",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <SidebarHeader
          sidebarOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
        />

        <SidebarMenus
          sidebarOpen={sidebarOpen}
          openMenus={openMenus}
          hoverSubmenu={hoverSubmenu}
          hoverCoords={hoverCoords}
          getMenuKey={getMenuKey}
          handleHoverMenu={handleHoverMenu}
          handleLeaveMenu={handleLeaveMenu}
          clearHoverTimer={clearHoverTimer}
          toggleMenu={toggleMenu}
          onSetHoverMenu={setHoverSubmenu}
        />
      </Box>

      {/* header section/right side */}
      <LayoutHeader />
    </Box>
  );
}

export default DashboardLayout;
