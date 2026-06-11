import { useEffect, useRef, useState } from "react";
import useCartStore from "../../store/cartStore.js";
import { Box, Typography, IconButton, Button, Paper } from "@mui/material";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import CartItem from "./CartItem.jsx";
import CustomerModal from "../customers_comp/CustomerModal.jsx";
import createCustomer from "../../api/customers_api/createCustomer.js";
import createOrder from "../../api/pos_api/createOrder.js";
import { toast } from "sonner";
import { useReactToPrint } from "react-to-print";
import getCustomerByPhone from "../../api/orders_api/getCustomerByPhone.js";
import { OrderPrintTemplate } from "../print/OrderPrintTemplate.jsx";
import CartSummary from "./CartSummary.jsx";
import getDiscountAmount from "../../utils/getDiscountAmount.js";
import CartCheckout from "./CartCheckout.jsx";
import Drafts from "./Drafts.jsx";
import DraftList from "./DraftList.jsx";
import CustomerSelect from "./CustomerSelect.jsx";

function CartList() {
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    discountValue,
    discountType,
    setCustomer,
    customer,
    draftData,
  } = useCartStore();
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [amountPaid, setAmountPaid] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [openCustomerModal, setOpenCustomerModal] = useState(false);
  const [order, setOrder] = useState(null);
  const printRef = useRef();

  //HANDLER
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Order_Details`,
  });

  const queryClient = useQueryClient();

  const { data: walkInCustomer } = useQuery({
    queryKey: ["walk-in-customer"],
    queryFn: () => getCustomerByPhone("walk-in"),
    staleTime: Infinity,
  });

  useEffect(() => {
    if (walkInCustomer?.data) {
      setSelectedCustomer(customer ? customer : walkInCustomer.data);
    }
  }, [walkInCustomer, customer]);

  useEffect(() => {
    if (order && order.id) {
      handlePrint();
      setOrder(null);
    }
  }, [order, handlePrint]);

  const { mutate } = useMutation({
    mutationFn: (customer) => createCustomer(customer),
    onSuccess: () => {
      refetch();
      setOpenCustomerModal(false);
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const { mutateAsync: createOrderMutation, isPending: createOrderPending } =
    useMutation({
      mutationFn: (order) => createOrder(order),
      onSuccess: (response) => {
        setOrder(response.data);
        clearCart();
        setAmountPaid("");
        setPaymentMethod("CASH");
        setSelectedCustomer(walkInCustomer.data);
        queryClient.invalidateQueries({ queryKey: ["products"], exact: false });
        queryClient.invalidateQueries({ queryKey: ["drafts"] });
      },
    });

  //handler function
  const handleCreateCustomerSubmit = (data) => {
    mutate(data);
    setOpenCustomerModal(false);
  };

  const handleOpenCustomerModal = () => {
    setOpenCustomerModal(true);
  };
  const handleCloseCustomerModal = () => {
    setOpenCustomerModal(false);
  };

  const handleCreateOrder = () => {
    try {
      const orderData = {
        items: items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          discount: item.discount || 0,
        })),
        discountType,
        discountValue,
        customerId: selectedCustomer ? selectedCustomer.id : walkInCustomer?.id,
        paymentMethod,
        amountPaid: paymentMethod === "UNPAID" ? 0 : Number(amountPaid),
        draftId: draftData?.id,
      };

      console.log(orderData, "orderData");

      toast.promise(createOrderMutation(orderData), {
        loading: "Creating order...",
        success: (data) => {
          return data?.message || "Order created successfully";
        },

        error: (err) => {
          const serverMessage = err?.response?.data?.message;
          return serverMessage || err.message || "Something went wrong";
        },
      });
    } catch (err) {
      console.log("Order creation failed:", err.message);
    }
  };

  const subTotal = items.reduce(
    (total, item) => total + item.basePrice * item.quantity,
    0,
  );

  // derived state

  const discount = getDiscountAmount(discountType, discountValue, subTotal);
  const total = subTotal - discount;

  const numericPaid = Number(amountPaid);
  const changeAmount = numericPaid > total ? numericPaid - total : 0;

  return (
    <Paper
      elevation={2}
      sx={{
        height: "calc(100vh - 120px)",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      {/* Cart Header */}
      <Box
        sx={{
          p: 2,
          bgcolor: "primary.main",
          color: "primary.contrastText",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h6"
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <ShoppingCartOutlinedIcon />
          Current Order
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
          {" "}
          <Typography variant="subtitle1" fontWeight="bold">
            {items.length} {items.length === 1 ? "Item" : "Items"}
          </Typography>{" "}
          <Drafts /> <DraftList />
        </Box>
      </Box>

      {/* Cart Items List */}
      <Box sx={{ flexGrow: 1, overflowY: "auto", p: 1 }}>
        {items.length === 0 ? (
          <Box
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: "text.secondary",
              opacity: 0.7,
            }}
          >
            <ShoppingCartOutlinedIcon sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h6">Cart is empty</Typography>
            <Typography variant="body2">
              Add products to start an order
            </Typography>
          </Box>
        ) : (
          <CartItem
            items={items}
            updateQuantity={updateQuantity}
            removeItem={removeItem}
          />
        )}
      </Box>

      {/* Cart Footer / Totals */}
      <Box
        sx={{
          p: 2,
          borderTop: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <CartSummary total={total} subTotal={subTotal} discount={discount} />

        <Box sx={{ mb: 2 }}>
          {/* Customer Search */}
          <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
            <CustomerSelect
              selectedCustomer={selectedCustomer}
              setSelectedCustomer={setSelectedCustomer}
              setCustomer={setCustomer}
            />
            <IconButton
              color="primary"
              onClick={handleOpenCustomerModal}
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1,
                height: "40px",
                width: "40px",
              }}
            >
              <PersonAddAlt1Icon />
            </IconButton>
            <CustomerModal
              open={openCustomerModal}
              onClose={handleCloseCustomerModal}
              onSave={handleCreateCustomerSubmit}
            />
          </Box>

          {/* Payment Methods */}
          <CartCheckout
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            amountPaid={amountPaid}
            setAmountPaid={setAmountPaid}
            changeAmount={changeAmount}
            selectedCustomer={selectedCustomer}
          />
        </Box>

        <Box sx={{ display: "flex", gap: 1.5 }}>
          <Button
            variant="outlined"
            color="error"
            onClick={clearCart}
            disabled={items.length === 0}
            sx={{ flex: 1, textTransform: "none", fontWeight: "bold" }}
          >
            Clear
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="large"
            disabled={items.length === 0 || createOrderPending}
            sx={{ flex: 2, textTransform: "none", fontWeight: "bold" }}
            onClick={handleCreateOrder}
          >
            Pay Now
          </Button>
        </Box>
      </Box>

      <Box sx={{ display: "none" }}>
        <OrderPrintTemplate ref={printRef} order={order} />
      </Box>
    </Paper>
  );
}

export default CartList;
