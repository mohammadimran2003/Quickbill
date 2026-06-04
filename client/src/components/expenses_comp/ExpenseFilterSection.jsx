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
import { useQuery } from "@tanstack/react-query";
import getExpenseCategories from "../../api/expenses_api/getExpenseCategories";

function ExpenseFilterSection({ onSetSorting }) {
  const [expenseAnchorEl, setExpenseAnchorEl] = useState(null);
  const [expenseFilter, setExpenseFilter] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  const { data: categoriesData } = useQuery({
    queryKey: ["expense-categories"],
    queryFn: () => getExpenseCategories(),
  });

  const categories = categoriesData?.data || [];

  const handleExpenseApply = () => {
    setSearchParams((prev) => ({
      ...Object.fromEntries(prev),
      search: expenseFilter,
      page: 1,
    }));
    setExpenseFilter("");
    setExpenseAnchorEl(null);
  };

  const hasFilters = Boolean(searchParams.toString());

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<AddCircleIcon />}
            onClick={(e) => setExpenseAnchorEl(e.currentTarget)}
            sx={{
              color: "text.primary",
              borderColor: "divider",
              "&:hover": {
                borderColor: "text.secondary",
                backgroundColor: "action.hover",
              },
            }}
          >
            Search
          </Button>
          {hasFilters && (
            <Button
              variant="outlined"
              startIcon={<ResetIcon />}
              onClick={() => {
                setSearchParams({});
                setExpenseFilter("");
                if (onSetSorting) onSetSorting([]);
              }}
            >
              Reset
            </Button>
          )}
        </Box>
        <Select
          value={searchParams.get("categoryId") || ""}
          onChange={(e) =>
            setSearchParams((prev) => ({
              ...Object.fromEntries(prev),
              categoryId: e.target.value,
              page: 1,
            }))
          }
          displayEmpty
          color="primary"
          size="small"
          sx={{ minWidth: 170 }}
        >
          <MenuItem value="">All Categories</MenuItem>
          {categories.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <Popover
        open={Boolean(expenseAnchorEl)}
        anchorEl={expenseAnchorEl}
        onClose={() => setExpenseAnchorEl(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Box sx={{ p: 3, minWidth: 300 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Search Expenses
          </Typography>
          <TextField
            fullWidth
            placeholder="Title"
            value={expenseFilter}
            onChange={(e) => setExpenseFilter(e.target.value)}
            size="small"
            sx={{ mb: 2 }}
          />
          <Button variant="contained" fullWidth onClick={handleExpenseApply}>
            Apply
          </Button>
        </Box>
      </Popover>
    </>
  );
}

export default ExpenseFilterSection;
