import PageHeader from "../../components/shared/PageHeader.jsx";
import PurchaseTable from "../../components/purchases_comp/PurchaseTable.jsx";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Purchases() {
  const navigate = useNavigate();

  const handleAddClick = () => {
    navigate("/purchases/create-purchase");
  };

  return (
    <Box>
      <PageHeader
        title="Purchases"
        btnText="Add Purchase"
        onBtnClick={handleAddClick}
      />

      <PurchaseTable />
    </Box>
  );
}

export default Purchases;
