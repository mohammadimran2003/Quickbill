import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Box,
  Typography,
  ListItemButton,
} from "@mui/material";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import getDrafts from "../../api/drafts_api/getDrafts.js";
import deleteDraft from "../../api/drafts_api/draftDelete.js";
import useCartStore from "../../store/cartStore.js";
import { toast } from "sonner";
import DeleteIcon from "@mui/icons-material/Delete";

function DraftList() {
  const [open, setOpen] = useState(false);
  const { loadDraft, clearCart } = useCartStore();

  const { data: draftsData, refetch } = useQuery({
    queryKey: ["drafts"],
    queryFn: () => getDrafts(),
    enabled: open,
  });

  const { mutate: deleteDraftMutation, isPending: isDeleting } = useMutation({
    mutationFn: (id) => deleteDraft(id),
    onSuccess: () => {
      toast.success("Draft deleted successfully");
      refetch();
    },
    onError: (err) => {
      const serverMessage = err?.response?.data?.message;
      toast.error(serverMessage || "Failed to delete draft");
    },
  });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleLoadDraft = (draft) => {
    clearCart();
    loadDraft(draft);
    toast.success("Draft loaded successfully");
    handleClose();
  };

  const handleDeleteDraft = (e, id) => {
    e.stopPropagation();
    deleteDraftMutation(id);
  };

  const drafts = draftsData?.data || [];

  return (
    <>
      <Button
        size="small"
        variant="contained"
        color="secondary"
        onClick={handleOpen}
      >
        Draft List
      </Button>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Saved Drafts</DialogTitle>
        <DialogContent>
          {drafts.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography variant="body2" color="text.secondary">
                No drafts found
              </Typography>
            </Box>
          ) : (
            <List>
              {drafts.map((draft) => (
                <ListItem
                  key={draft.id}
                  disablePadding
                  sx={{
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 1,
                    mb: 1,
                  }}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      onClick={(e) => handleDeleteDraft(e, draft.id)}
                      disabled={isDeleting}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemButton
                    onClick={() => handleLoadDraft(draft)}
                    sx={{ pr: 8 }}
                  >
                    <ListItemText
                      primary={draft.name || `Draft ${draft.id.slice(-6)}`}
                      secondary={`${draft.items?.length || 0} items`}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default DraftList;
