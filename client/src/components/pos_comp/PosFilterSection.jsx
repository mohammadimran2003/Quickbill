import { Box, Autocomplete, TextField, Button } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import getBrands from "../../api/brands_api/getBrands.js";
import getCategories from "../../api/categories_api/getCategories.js";
import { useSearchParams } from "react-router-dom";
import ResetIcon from "@mui/icons-material/RestartAlt";

function PosFilterSection({ hasFilters }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const { data: brandsData } = useQuery({
    queryKey: ["brands"],
    queryFn: () => getBrands(),
  });
  const brands = brandsData?.data || [];

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });
  const categories = categoriesData?.data || [];

  const handleFilterChange = (key, newValue) => {
    setSearchParams((prev) => {
      const currentParams = Object.fromEntries(prev);
      currentParams.page = "1";

      if (newValue && newValue.id) {
        currentParams[key] = newValue.id;
      } else {
        delete currentParams[key];
      }

      return currentParams;
    });
  };

  const currentBrandId = searchParams.get("brand");
  const currentCategoryId = searchParams.get("category");

  const selectedBrand =
    currentBrandId && currentBrandId !== "undefined"
      ? brands.find((brand) => brand.id === currentBrandId) || null
      : null;

  const selectedCategory =
    currentCategoryId && currentCategoryId !== "undefined"
      ? categories.find((category) => category.id === currentCategoryId) || null
      : null;

  return (
    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
      <Autocomplete
        options={brands}
        value={selectedBrand}
        onChange={(event, newValue) => handleFilterChange("brand", newValue)}
        getOptionLabel={(option) => option.name || ""}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        sx={{ width: 250 }}
        size="small"
        renderInput={(params) => (
          <TextField {...params} label="Filter by Brand" />
        )}
      />

      {/* Categories Autocomplete */}
      <Autocomplete
        options={categories}
        value={selectedCategory}
        onChange={(event, newValue) => handleFilterChange("category", newValue)}
        getOptionLabel={(option) => option.name || ""}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        sx={{ width: 250 }}
        size="small"
        renderInput={(params) => (
          <TextField {...params} label="Filter by Category" />
        )}
      />

      {hasFilters && (
        <Button
          variant="outlined"
          startIcon={<ResetIcon />}
          onClick={() => {
            setSearchParams({});
          }}
        >
          Reset
        </Button>
      )}
    </Box>
  );
}

export default PosFilterSection;
