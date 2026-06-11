import React, { useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import {
  Grid,
  TextField,
  Button,
  Box,
  IconButton,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import FormSection from "./FormSection.jsx";
import { Autocomplete, Chip } from "@mui/material";
import { toast } from "sonner";

const MediaMetadataSection = () => {
  const { control, watch, setValue, register } = useFormContext();
  const [inputValue, setInputValue] = useState("");
  const [saveImages, setSaveImages] = useState([]);
  register("images", { defaultValue: [] });

  const handleAddImage = () => {
    if (saveImages.length >= 5) {
      return toast.error("You can only add up to 5 images");
    }
    const trimmedUrl = inputValue.trim();
    if (!trimmedUrl) {
      return toast.error("Image URL is required");
    }

    setValue("images", [...saveImages, trimmedUrl], { shouldValidate: true });
    setSaveImages((prev) => [...prev, trimmedUrl]);
    setInputValue("");
  };

  const handleDeleteImage = (urlToDelete) => {
    const updatedImages = saveImages.filter((url) => url !== urlToDelete);
    setValue("images", updatedImages, { shouldValidate: true });
    setSaveImages(updatedImages);
  };

  return (
    <FormSection title="Media & Metadata">
      <Grid
        size={6}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Grid size={9}>
          <TextField
            label="Product Image URL"
            fullWidth
            variant="outlined"
            size="small"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="https://example.com/image1.jpg"
            disabled={saveImages.length >= 5}
          />
        </Grid>

        <Grid size={3}>
          <Button
            variant="contained"
            size="small"
            fullWidth
            onClick={handleAddImage}
            sx={{ height: "40px" }}
            disabled={saveImages.length >= 5}
          >
            Add
          </Button>
        </Grid>
      </Grid>
      {watch("images") && watch("images")?.length > 0 && (
        <Grid size={6}>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
              mt: 2,
              p: 2,
              border: "1px dashed",
              borderColor: "divider",
              borderRadius: 1,
              bgcolor: "grey.50",
            }}
          >
            {(watch("images") || [])?.map((url, index) => (
              <Box
                key={index}
                sx={{
                  position: "relative",
                  width: 80,
                  height: 80,
                  borderRadius: 1,
                  overflow: "hidden",
                  border: "1px solid",
                  borderColor: "divider",
                  boxShadow: 1,
                  "&:hover .delete-overlay": { opacity: 1 },
                }}
              >
                <img
                  src={url}
                  alt={`Product ${index + 1}`}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => {
                    e.target.src = "https://placehold.co/80?text=Invalid+URL";
                  }}
                />

                <Box
                  className="delete-overlay"
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    bgcolor: "rgba(0, 0, 0, 0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: 0,
                    transition: "opacity 0.2s",
                  }}
                >
                  <Tooltip title="Delete">
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteImage(url)}
                      sx={{
                        color: "error.main",
                        bgcolor: "white",
                        "&:hover": { bgcolor: "grey.100" },
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            ))}
          </Box>
        </Grid>
      )}

      <br />

      <Grid size={6} sx={{ mt: 3 }}>
        <Controller
          name="tags"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Autocomplete
              multiple
              freeSolo
              disablePortal
              sx={{ width: "100%" }}
              options={[]}
              value={value || []}
              onChange={(event, newValue) => onChange(newValue)}
              renderTags={(tagValue, getTagProps) =>
                tagValue.map((option, index) => {
                  const { key, ...tagProps } = getTagProps({ index });
                  return (
                    <Chip
                      key={key}
                      variant="outlined"
                      label={option}
                      size="small"
                      {...tagProps}
                    />
                  );
                })
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Tags"
                  size="small"
                  placeholder="Type and press Enter"
                />
              )}
            />
          )}
        />
      </Grid>
    </FormSection>
  );
};

export default MediaMetadataSection;
