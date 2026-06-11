import PageHeader from "../../components/shared/PageHeader.jsx";
import ProductTable from "../../components/products_comp/ProductTable.jsx";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Products() {
  const navigate = useNavigate();

  const handleAddClick = () => {
    navigate("/products/create-products");
  };

  const handleEdit = (product) => {
    navigate(`/products/edit-products/${product.id}`);
  };

  return (
    <Box>
      <PageHeader
        title="Products"
        btnText="Add Product"
        onBtnClick={handleAddClick}
      />

      <ProductTable onEditClick={handleEdit} />
    </Box>
  );
}

export default Products;
