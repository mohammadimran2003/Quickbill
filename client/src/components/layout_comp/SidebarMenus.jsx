import {
  Box,
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material";
import menuSections from "../../data/MenuSections.jsx";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { NavLink, useLocation } from "react-router-dom";

function SidebarMenus({
  sidebarOpen,
  openMenus,
  hoverSubmenu,
  hoverCoords,
  getMenuKey,
  handleHoverMenu,
  handleLeaveMenu,
  toggleMenu,
  clearHoverTimer,
}) {
  const theme = useTheme();
  const pathname = useLocation().pathname;

  return (
    <Box
      sx={{
        flex: 1,
        overflowY: "auto",
        px: sidebarOpen ? 2.5 : 0,
        py: 1,
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
      {menuSections.map((menu) => (
        <Box key={menu.id} sx={{ mb: 2 }}>
          {sidebarOpen && (
            <Typography
              variant="subtitle2"
              sx={{
                px: 1,
                mb: 1.5,
                textTransform: "uppercase",
                letterSpacing: 0.8,
                color: theme.palette.text.secondary,
              }}
            >
              {menu.section}
            </Typography>
          )}
          <List disablePadding>
            {menu.items.map((item) => {
              const isDirectActive = pathname === item.path;
              const isChildActive = item.subitems?.some(
                (sub) => pathname === sub.path,
              );
              const isParentActive = isDirectActive || isChildActive;

              return (
                <ListItem
                  key={item.id}
                  disablePadding
                  sx={{ display: "block" }}
                >
                  <ListItemButton
                    component={!item.subitems?.length ? NavLink : "div"}
                    to={!item.subitems?.length ? item.path : undefined}
                    onClick={() => item.subitems?.length && toggleMenu(item)}
                    onMouseEnter={(event) => handleHoverMenu(event, item)}
                    onMouseLeave={handleLeaveMenu}
                    sx={{
                      minHeight: 48,
                      px: sidebarOpen ? 2 : 0,
                      mx: sidebarOpen ? 0 : 1,
                      my: 1,
                      justifyContent: sidebarOpen ? "initial" : "center",
                      borderRadius: 2,
                      "&:hover": {
                        bgcolor: !item.subitems?.length
                          ? theme.palette.primary.dark
                          : theme.palette.action.hover,
                        color: theme.palette.primary.contrastText,
                      },

                      bgcolor: isDirectActive
                        ? "primary.main"
                        : isChildActive
                          ? theme.palette.mode === "light"
                            ? "rgba(0, 167, 111, 0.08)"
                            : "rgba(0, 167, 111, 0.16)"
                          : "transparent",
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: sidebarOpen ? 2 : 0,
                        justifyContent: "center",
                        color:
                          pathname === item.path
                            ? "primary.contrastText"
                            : "primary.main",
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    {sidebarOpen && (
                      <ListItemText
                        primary={item.label}
                        sx={{
                          color:
                            pathname === item.path
                              ? "primary.contrastText"
                              : "text.primary",
                        }}
                      />
                    )}
                    {sidebarOpen &&
                      item.subitems?.length &&
                      (openMenus[getMenuKey(item)] ? (
                        <ExpandLess sx={{ color: "text.primary" }} />
                      ) : (
                        <ExpandMore sx={{ color: "text.primary" }} />
                      ))}
                  </ListItemButton>

                  {sidebarOpen && item.subitems?.length && (
                    <Collapse
                      in={openMenus[getMenuKey(item)]}
                      timeout="auto"
                      unmountOnExit
                    >
                      <List disablePadding sx={{ pl: 5, pr: 1 }}>
                        {item.subitems.map((sub, index) => (
                          <ListItem
                            key={`${item.id || item.path}-collapsed-${index}`}
                            disablePadding
                          >
                            <ListItemButton
                              component={NavLink}
                              to={sub.path}
                              sx={{
                                py: 0.75,
                                px: 1.25,
                                borderRadius: 1,
                                "&:hover": {
                                  bgcolor: theme.palette.action.hover,
                                },
                                bgcolor: `${pathname === sub.path ? "secondary.main" : "transparent"}`,
                              }}
                            >
                              <Typography
                                variant="body2"
                                color="primary"
                                sx={{ color: "text.primary" }}
                              >
                                {sub.label}
                              </Typography>
                            </ListItemButton>
                          </ListItem>
                        ))}
                      </List>
                    </Collapse>
                  )}
                  {/* Hover submenu for collapsed sidebar */}
                  {!sidebarOpen && hoverSubmenu?.id === getMenuKey(item) && (
                    <Paper
                      elevation={6}
                      onMouseEnter={clearHoverTimer}
                      onMouseLeave={handleLeaveMenu}
                      sx={{
                        position: "fixed",
                        left: hoverCoords.left + 4,
                        top: hoverCoords.top,
                        width: 200,
                        p: 1,
                        borderRadius: 2,
                        boxShadow: theme.shadows[6],
                        zIndex: theme.zIndex.snackbar,
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{ mb: 1, fontWeight: 700 }}
                      >
                        {item.label}
                      </Typography>

                      <List disablePadding>
                        {item.subitems.map((sub, index) => (
                          <ListItem
                            key={`${item.id || item.path}-hover-${index}`}
                            disablePadding
                          >
                            <ListItemButton
                              component={NavLink}
                              to={sub.path}
                              sx={{
                                py: 0.75,
                                px: 1.25,
                                borderRadius: 1,
                                "&:hover": {
                                  bgcolor: theme.palette.action.hover,
                                },
                              }}
                            >
                              <Typography variant="body2" color="text.primary">
                                {sub.label}
                              </Typography>
                            </ListItemButton>
                          </ListItem>
                        ))}
                      </List>
                    </Paper>
                  )}
                </ListItem>
              );
            })}
          </List>
        </Box>
      ))}
    </Box>
  );
}

export default SidebarMenus;
