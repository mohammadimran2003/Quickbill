import { useFormContext, Controller } from "react-hook-form";
import {
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  TextField,
} from "@mui/material";
import FormSection from "./FormSection.jsx";

const CategoryTypeSection = ({ categoriesData, brandsData }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <FormSection title="Category & Type">
      <Grid size={4}>
        <Controller
          name="categoryId"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth size="small" error={!!errors.categoryId}>
              <InputLabel>Category</InputLabel>
              <Select {...field} label="Category">
                {categoriesData?.data?.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{errors.categoryId?.message}</FormHelperText>
            </FormControl>
          )}
        />
      </Grid>

      <Grid size={4}>
        <Controller
          name="brandId"
          control={control}
          defaultValue=""
          render={({ field, fieldState: { error } }) => (
            <FormControl
              fullWidth
              size="small"
              variant="outlined"
              error={!!error}
            >
              <InputLabel id="brand-select-label">Brand</InputLabel>
              <Select
                {...field}
                labelId="brand-select-label"
                id="brand-select"
                label="Brand"
                value={field.value ?? ""}
              >
                {brandsData?.data?.map((brand) => (
                  <MenuItem key={brand.id} value={brand.id}>
                    {brand.name}
                  </MenuItem>
                ))}
              </Select>
              {error && <FormHelperText>{error.message}</FormHelperText>}
            </FormControl>
          )}
        />
      </Grid>

      <Grid size={4}>
        <Controller
          name="productType"
          control={control}
          render={({ field }) => (
            <TextField
              select
              label="Product Type"
              fullWidth
              variant="outlined"
              size="small"
              {...field}
              value={field.value ?? "SIMPLE"}
            >
              <MenuItem value="SIMPLE">Simple</MenuItem>
              <MenuItem value="VARIANT">Variant</MenuItem>
              <MenuItem value="COMPOSITE">Composite</MenuItem>
            </TextField>
          )}
        />
      </Grid>
    </FormSection>
  );
};

export default CategoryTypeSection;
