import React from "react";
import {
  Box,
  Stack,
  Typography,
  Chip,
  Button,
  Tooltip,
  IconButton,
} from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import EditIcon from "@mui/icons-material/Edit";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { useReactToPrint } from "react-to-print";
import { OrderPrintTemplate } from "../../components/print/OrderPrintTemplate";
import PrintBtn from "../shared/PrintBtn";

const OrderHeader = ({ order, printRef }) => {
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Order_Details`,
  });

  return (
    <Box
      sx={{
        mb: 4,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
      }}
    >
      <Stack spacing={1}>
        <Typography variant="h4" fontWeight="bold" color="primary">
          Order #{order?.orderNumber}
        </Typography>
        <Stack direction="row" spacing={2} color="text.secondary">
          <Stack direction="row" spacing={1}>
            <CalendarTodayIcon fontSize="small" />
            <Typography variant="body2">
              {new Date(order?.createdAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Typography>
          </Stack>
          <Chip
            label={order?.status}
            color={order?.status === "COMPLETED" ? "success" : "warning"}
            size="small"
          />
          <Chip label={order?.orderType} variant="outlined" size="small" />
        </Stack>
      </Stack>

      <PrintBtn onHandlePrint={handlePrint} />
    </Box>
  );
};

export default OrderHeader;
