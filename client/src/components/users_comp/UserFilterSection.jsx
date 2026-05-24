import {
  Box,
  Button,
  Popover,
  TextField,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ResetIcon from "@mui/icons-material/RestartAlt";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

function UserFilterSection({ onSetSorting }) {
  const [nameAnchorEl, setNameAnchorEl] = useState(null);
  const [emailAnchorEl, setEmailAnchorEl] = useState(null);
  const [nameFilter, setNameFilter] = useState("");
  const [emailFilter, setEmailFilter] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  const handleNameApply = () => {
    setSearchParams((prev) => ({
      ...Object.fromEntries(prev),
      search: nameFilter,
      page: 1,
    }));
    setNameFilter("");
    setNameAnchorEl(null);
  };

  const handleEmailApply = () => {
    setSearchParams((prev) => ({
      ...Object.fromEntries(prev),
      email: emailFilter,
      page: 1,
    }));
    setEmailFilter("");
    setEmailAnchorEl(null);
  };

  const hasFilters = Boolean(searchParams.toString());

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <Button
            variant="outlined"
            startIcon={<AddCircleIcon />}
            onClick={(e) => setNameAnchorEl(e.currentTarget)}
            sx={{
              color: "text.primary",
              borderColor: "divider",
              "&:hover": {
                borderColor: "text.secondary",
                backgroundColor: "action.hover",
              },
            }}
          >
            Name
          </Button>
          <Button
            variant="outlined"
            startIcon={<AddCircleIcon />}
            onClick={(e) => setEmailAnchorEl(e.currentTarget)}
            sx={{
              color: "text.primary",
              borderColor: "divider",
              "&:hover": {
                borderColor: "text.secondary",
                backgroundColor: "action.hover",
              },
            }}
          >
            Email
          </Button>
          {hasFilters && (
            <Button
              variant="outlined"
              startIcon={<ResetIcon />}
              onClick={() => {
                setSearchParams({});
                setNameFilter("");
                setEmailFilter("");
                if (onSetSorting) onSetSorting([]);
              }}
            >
              Reset
            </Button>
          )}
        </Box>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <Select
            value={searchParams.get("role") || ""}
            onChange={(e) =>
              setSearchParams((prev) => ({
                ...Object.fromEntries(prev),
                role: e.target.value,
                page: 1,
              }))
            }
            displayEmpty
            color="primary"
            size="small"
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="">All Roles</MenuItem>
            <MenuItem value="ADMIN">Admin</MenuItem>
            <MenuItem value="MANAGER">Manager</MenuItem>
            <MenuItem value="SALESMAN">Salesman</MenuItem>
          </Select>
          <Select
            value={searchParams.get("isActive") || ""}
            onChange={(e) =>
              setSearchParams((prev) => {
                if (e.target.value === "") {
                  prev.delete("isActive");
                } else {
                  prev.set("isActive", e.target.value);
                }
                return prev;
              })
            }
            displayEmpty
            color="primary"
            size="small"
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="">All Status</MenuItem>
            <MenuItem value="true">Active</MenuItem>
            <MenuItem value="false">Inactive</MenuItem>
          </Select>
        </Box>
      </Box>
      <Popover
        open={Boolean(nameAnchorEl)}
        anchorEl={nameAnchorEl}
        onClose={() => setNameAnchorEl(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Box sx={{ p: 3, minWidth: 300 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Filter by Name
          </Typography>
          <TextField
            fullWidth
            placeholder="Enter user name"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            size="small"
            sx={{ mb: 2 }}
          />
          <Button variant="contained" fullWidth onClick={handleNameApply}>
            Apply
          </Button>
        </Box>
      </Popover>
      <Popover
        open={Boolean(emailAnchorEl)}
        anchorEl={emailAnchorEl}
        onClose={() => setEmailAnchorEl(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Box sx={{ p: 3, minWidth: 300 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Filter by Email
          </Typography>
          <TextField
            fullWidth
            placeholder="Enter email address"
            value={emailFilter}
            onChange={(e) => setEmailFilter(e.target.value)}
            size="small"
            sx={{ mb: 2 }}
          />
          <Button variant="contained" fullWidth onClick={handleEmailApply}>
            Apply
          </Button>
        </Box>
      </Popover>
    </>
  );
}

export default UserFilterSection;
