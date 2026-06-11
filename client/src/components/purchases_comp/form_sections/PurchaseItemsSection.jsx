import { useState } from "react";
import {
  Grid,
  TextField,
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
import FormSection from "./FormSection.jsx";
import usePurchaseStore from "../../../store/purchaseStore.js";
import { useFormContext } from "react-hook-form";

const PurchaseItemsSection = ({ productsData }) => {
  const [productSearch, setProductSearch] = useState(null);

  const { items, addItem, removeItem, updateQuantity, updateUnitCost } =
    usePurchaseStore();

  const {
    formState: { errors },
    clearErrors,
  } = useFormContext();

  const handleAddProduct = (event, product) => {
    if (product) {
      addItem(product);
      setProductSearch(null);
      // Clear error when item is added (form mode "all" will handle re-validation)
      clearErrors("items");
    }
  };
  const handleQuantityChange = (index, value) => {
    const quantity = parseInt(value) || 0;
    updateQuantity(index, quantity);
  };

  const handleUnitCostChange = (index, value) => {
    const unitCost = parseFloat(value) || 0;
    updateUnitCost(index, unitCost);
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
              error={!!errors.items}
              helperText={errors.items?.message}
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
              {items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.productName}</TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      size="small"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(index, e.target.value)
                      }
                      onFocus={(e) => e.target.select()}
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
                      value={item.unitCost}
                      onChange={(e) =>
                        handleUnitCostChange(index, e.target.value)
                      }
                      onFocus={(e) => e.target.select()}
                      slotProps={{
                        htmlInput: {
                          min: 0,
                          step: "0.01",
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell>{item.total?.toFixed(2)}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="error"
                      size="small"
                      onClick={() => {
                        removeItem(index);
                        trigger("items");
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {items.length === 0 && (
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
      </Grid>
    </FormSection>
  );
};

export default PurchaseItemsSection;
