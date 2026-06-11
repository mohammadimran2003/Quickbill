import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Stack,
  Button,
  Divider,
} from "@mui/material";
import { useState } from "react";
import rechargeWalletCustomer from "../../api/customers_api/rechargeWalletCustomer.js";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function RechargeWalletModal({
  isRechargeModalOpen,
  setIsRechargeModalOpen,
  walletBalance,
  totalDue,
  id,
}) {
  const [rechargeAmount, setRechargeAmount] = useState("");
  const [rechargeNote, setRechargeNote] = useState("");

  const { mutateAsync } = useMutation({
    mutationFn: ({ id, walletRechargeData }) =>
      rechargeWalletCustomer(id, walletRechargeData),
    onSuccess: () => {
      setIsRechargeModalOpen(false);
    },
  });

  const queryClient = useQueryClient();

  const handleRecharge = () => {
    const walletRechargeData = {
      customerId: id,
      amount: +rechargeAmount,
      note: rechargeNote,
    };

    toast.promise(mutateAsync({ id, walletRechargeData }), {
      loading: "Recharging wallet...",
      success: () => {
        queryClient.invalidateQueries({ queryKey: ["customers"] });
        return "Wallet rechargeddd successfully";
      },
      error: (error) => {
        return error?.response?.data?.message || "Failed to recharge wallet";
      },
    });
  };

  return (
    <Dialog
      open={isRechargeModalOpen}
      onClose={() => setIsRechargeModalOpen(false)}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Wallet Recharge</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} sx={{ mb: 3 }}>
          <Typography variant="body1">
            <strong>Current Balance:</strong> ৳
            {walletBalance?.toLocaleString() || 0}
          </Typography>
          <Typography variant="body1">
            <strong>Current Due:</strong> ৳{totalDue?.toLocaleString() || 0}
          </Typography>
        </Stack>
        <Divider sx={{ mb: 3 }} />
        <Stack spacing={3}>
          <TextField
            label="Amount"
            type="number"
            fullWidth
            value={rechargeAmount}
            onChange={(e) => setRechargeAmount(e.target.value)}
            placeholder="Enter recharge amount"
          />
          <TextField
            label="Note"
            multiline
            rows={3}
            fullWidth
            value={rechargeNote}
            onChange={(e) => setRechargeNote(e.target.value)}
            placeholder="Enter any note (optional)"
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={() => setIsRechargeModalOpen(false)} color="inherit">
          Cancel
        </Button>
        <Button variant="contained" color="primary" onClick={handleRecharge}>
          Recharge
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default RechargeWalletModal;
