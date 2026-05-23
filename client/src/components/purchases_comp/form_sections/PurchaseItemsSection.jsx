import { useState } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import {
  Grid,
  TextField,
  Typography,
  Autocomplete,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import FormSection from "./FormSection";

const PurchaseItemsSection = ({ productsData }) => {
  const [productSearch, setProductSearch] = useState(null);
  const [quantityInput, setQuantityInput] = useState(1);
  const [unitCostInput, setUnitCostInput] = useState(0);

  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext();

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "items",
  });

  const items = watch("items");

  const handleAddProduct = (event, product) => {
    if (product) {
      const existingItemIndex = items.findIndex(
        (item) => item.productId === product.id,
      );

      const productCost = product.costPrice || 0;
      const productName = product.name;

      if (existingItemIndex >= 0) {
        const currentItem = items[existingItemIndex];
        const newQuantity = currentItem.quantity + 1;

        update(existingItemIndex, {
          ...currentItem,
          productName,
          quantity: newQuantity,
          unitCost: productCost,
          total: newQuantity * productCost,
        });
      } else {
        append({
          productId: product.id,
          productName,
          quantity: 1,
          unitCost: productCost,
          total: productCost,
        });
      }
      setProductSearch(null);
    }
  };

  const handleQuantityChange = (index, value) => {
    const quantity = parseInt(value) || 0;
    const item = items[index];
    const newTotal = quantity * item.unitCost;
    update(index, {
      ...item,
      quantity,
      total: newTotal,
    });
  };

  const handleUnitCostChange = (index, value) => {
    const unitCost = parseFloat(value) || 0;
    const item = items[index];
    const newTotal = item.quantity * unitCost;
    update(index, {
      ...item,
      unitCost,
      total: newTotal,
    });
  };

  return (
    <FormSection title="Purchase Items">
      <Grid size={12}>
        <Autocomplete
          options={productsData?.data || []}
          getOptionLabel={(option) =>
            `${option.name} (${option.sku || option.barcode || "No SKU"})`
          }
          value={productSearch}
          onChange={handleAddProduct}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search and Add Product"
              variant="outlined"
              size="small"
            />
          )}
        />
      </Grid>

      <Grid size={12}>
        <TableContainer component={Paper} variant="outlined" sx={{ mt: 2 }}>
          <Table size="small">
            <TableHead sx={{ bgcolor: "action.hover" }}>
              <TableRow>
                <TableCell>Product Name</TableCell>
                <TableCell width="15%">Quantity</TableCell>
                <TableCell width="20%">Unit Cost</TableCell>
                <TableCell width="20%">Total</TableCell>
                <TableCell align="center" width="10%">
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {fields.map((field, index) => (
                <TableRow key={field.id}>
                  <TableCell>{field.productName}</TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      size="small"
                      value={quantityInput}
                      onChange={(e) => setQuantityInput(e.target.value)}
                      onBlur={(e) =>
                        handleQuantityChange(index, e.target.value)
                      }
                      slotProps={{
                        htmlInput: {
                          min: 1,
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      size="small"
                      value={unitCostInput}
                      onChange={(e) => setUnitCostInput(e.target.value)}
                      onBlur={(e) =>
                        handleUnitCostChange(index, e.target.value)
                      }
                      slotProps={{
                        htmlInput: {
                          min: 0,
                          step: "0.01",
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell>{field.total?.toFixed(2)}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="error"
                      size="small"
                      onClick={() => remove(index)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {fields.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    align="center"
                    sx={{ py: 3, color: "text.secondary" }}
                  >
                    No items added yet. Please search and select a product
                    above.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {errors.items && (
          <Typography
            color="error"
            variant="caption"
            sx={{ mt: 1, display: "block" }}
          >
            {errors.items.message}
          </Typography>
        )}
      </Grid>
    </FormSection>
  );
};

export default PurchaseItemsSection;
