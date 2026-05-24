import { TextField } from "@mui/material";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const QuantityInput = ({ item, updateQuantity }) => {
  const [value, setValue] = useState(item.quantity);
  const maxQuantity = item.stock;

  useEffect(() => {
    setValue(item.quantity);
  }, [item.quantity]);

  const handleChange = (e) => {
    const inputVal = e.target.value;

    if (inputVal === "") {
      setValue("");
      return;
    }

    let finalVal = Number(inputVal);

    if (finalVal < 1) {
      finalVal = 1;
    }

    if (finalVal > maxQuantity) {
      toast.warning("Stock limit exceeded");
      finalVal = maxQuantity;
    }

    setValue(finalVal);
    updateQuantity(item.id, finalVal);
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
      sx={{ width: "70px" }}
      size="small"
    />
  );
};

export default QuantityInput;
