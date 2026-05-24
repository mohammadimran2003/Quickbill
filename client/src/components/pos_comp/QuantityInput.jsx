import { TextField } from "@mui/material";
import { useState, useEffect } from "react";

const QuantityInput = ({ item, updateQuantity }) => {
  const [value, setValue] = useState(item.quantity);

  const maxQuantity = item.stock;

  useEffect(() => {
    setValue(item.quantity);
  }, [item.quantity]);

  const handleChange = (e) => {
    const val = e.target.value;
    setValue(val);

    if (val < 0) {
      setValue(1);
    }

    if (val > maxQuantity) {
      setValue(maxQuantity);
    }
  };

  const handleBlur = () => {
    const num = Number(value);
    if (!value || num < 1) {
      setValue(1);
      updateQuantity(item.id, 1);
    }
  };

  return (
    <TextField
      value={value}
      type="number"
      placeholder="1"
      onChange={handleChange}
      onBlur={handleBlur}
      sx={{ width: "60px" }}
      size="small"
      max={5}
      slotProps={{
        input: { min: 1 },
      }}
    />
  );
};

export default QuantityInput;
