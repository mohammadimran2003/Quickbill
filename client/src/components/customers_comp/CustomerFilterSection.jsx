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

function CustomerFilterSection({ onSetSorting }) {
  const [emailAnchorEl, setEmailAnchorEl] = useState(null);
  const [emailFilter, setEmailFilter] = useState("");
  const [phoneAnchorEl, setPhoneAnchorEl] = useState(null);
  const [phoneFilter, setPhoneFilter] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  const handleEmailApply = () => {
    setSearchParams((prev) => ({
      ...Object.fromEntries(prev),
      email: emailFilter,
      page: 1,
    }));
    setEmailFilter("");
    setEmailAnchorEl(null);
  };

  const handlePhoneApply = () => {
    setSearchParams((prev) => ({
      ...Object.fromEntries(prev),
      phone: phoneFilter,
      page: 1,
    }));
    setPhoneFilter("");
    setPhoneAnchorEl(null);
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
          <Button
            variant="outlined"
            startIcon={<AddCircleIcon />}
            onClick={(e) => setPhoneAnchorEl(e.currentTarget)}
            sx={{
              color: "text.primary",
              borderColor: "divider",
              "&:hover": {
                borderColor: "text.secondary",
                backgroundColor: "action.hover",
              },
            }}
          >
            Phone number
          </Button>
          {hasFilters && (
            <Button
              variant="outlined"
              startIcon={<ResetIcon />}
              onClick={() => {
                setSearchParams({});
                setEmailFilter("");
                setPhoneFilter("");
                if (onSetSorting) onSetSorting([]);
              }}
            >
              Reset
            </Button>
          )}
        </Box>
        <Select
          value={searchParams.get("customerType") || ""}
          onChange={(e) =>
            setSearchParams((prev) => ({
              ...Object.fromEntries(prev),
              customerType: e.target.value,
              page: 1,
            }))
          }
          displayEmpty
          color="primary"
          size="small"
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="">All Customers</MenuItem>
          <MenuItem value="REGULAR">Regular</MenuItem>
          <MenuItem value="WHOLESALE">Wholesale</MenuItem>
          <MenuItem value="VIP">VIP</MenuItem>
        </Select>
      </Box>
      {/* Email Filter Popover */}
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
            placeholder="Enter email"
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
      {/* Phone Filter Popover */}
      <Popover
        open={Boolean(phoneAnchorEl)}
        anchorEl={phoneAnchorEl}
        onClose={() => setPhoneAnchorEl(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Box sx={{ p: 3, minWidth: 300 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Filter by Phone Number
          </Typography>
          <TextField
            fullWidth
            placeholder="Enter phone number"
            value={phoneFilter}
            onChange={(e) => setPhoneFilter(e.target.value)}
            size="small"
            sx={{ mb: 2 }}
          />
          <Button variant="contained" fullWidth onClick={handlePhoneApply}>
            Apply
          </Button>
        </Box>
      </Popover>
    </>
  );
}

export default CustomerFilterSection;
