import React, { useState, useCallback, useEffect } from "react";
import {
  Autocomplete,
  TextField,
  CircularProgress,
  Box,
  Typography,
} from "@mui/material";
import { debounce } from "lodash";
import { useQuery } from "@tanstack/react-query";
import getCustomers from "../../api/customers_api/getCustomers.js";

const CustomerSelect = ({
  selectedCustomer,
  setSelectedCustomer,
  setCustomer,
}) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchTerm(value);
    }, 300),
    [],
  );

  const { data: customersData, isLoading } = useQuery({
    queryKey: ["customers", { search: searchTerm }],
    queryFn: () => getCustomers({ search: searchTerm }),
    enabled: true,
  });

  const customers = customersData?.data || [];

  return (
    <Autocomplete
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      options={customers}
      loading={isLoading}
      getOptionLabel={(option) =>
        option.name ? `${option.name} (${option.phone})` : ""
      }
      getOptionKey={(option) => option.id}
      value={selectedCustomer}
      onChange={(_, newValue) => {
        setSelectedCustomer(newValue);
        setCustomer(newValue);
      }}
      onInputChange={(_, newInputValue) => {
        debouncedSearch(newInputValue);
      }}
      renderOption={(props, option) => {
        const { key, ...optionProps } = props;
        return (
          <Box
            component="li"
            key={option.id}
            {...optionProps}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              py: 1,
            }}
          >
            <Typography variant="body1" fontWeight={600}>
              {option.name}
            </Typography>

            <Typography variant="caption" color="text.secondary">
              📱 {option.phone} | 🏷️ {option.customerType || "REGULAR"}
            </Typography>
          </Box>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Search Customer (Name or Phone)"
          size="small"
          fullWidth
        />
      )}
      sx={{ flexGrow: 1 }}
      size="small"
    />
  );
};

export default CustomerSelect;
