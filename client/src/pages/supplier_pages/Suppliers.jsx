import PageHeader from "../../components/shared/PageHeader";
import SupplierTable from "../../components/suppliers_comp/SupplierTable";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Suppliers() {
  const navigate = useNavigate();

  const handleAddClick = () => {
    navigate("/suppliers/create-supplier");
  };

  return (
    <Box>
      <PageHeader
        title="Suppliers"
        btnText="Add Supplier"
        onBtnClick={handleAddClick}
      />

      <SupplierTable />
    </Box>
  );
}

export default Suppliers;
