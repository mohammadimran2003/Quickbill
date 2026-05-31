import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AuthLayout from "./layouts/AuthLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import PrivateRoute from "./components/PrivateRoute";
import Products from "./pages/Product_pages/Products";
import ProductForm from "./pages/Product_pages/ProductForm";
import Categories from "./pages/category_pages/Categories";
import Brands from "./pages/brand_pages/Brands";
import BrandDetailsPage from "./pages/brand_pages/BrandDetailsPage";
import CategoryDetailsPage from "./pages/category_pages/CategoryDetailsPage";
import BrandForm from "./pages/brand_pages/BrandForm";
import CategoryForm from "./pages/category_pages/CategoryForm";
import ProductDetailsPage from "./pages/Product_pages/ProductDetailsPage";
import Orders from "./pages/order_pages/Orders";
import OrderDetailsPage from "./pages/order_pages/OrderDetailsPage";
import POS from "./pages/POS";
import CustomerForm from "./pages/customer_pages/CustomerForm";
import Customers from "./pages/customer_pages/Customers";
import CustomerDetailsPage from "./pages/customer_pages/CustomerDetailsPage";
import SupplierForm from "./pages/supplier_pages/SupplierForm";
import Suppliers from "./pages/supplier_pages/Suppliers";
import SupplierDetailsPage from "./pages/supplier_pages/SupplierDetailsPage";
import PurchaseForm from "./pages/purchase_pages/PurchaseForm";
import Purchases from "./pages/purchase_pages/Purchases";
import PurchaseDetailsPage from "./pages/purchase_pages/PurchaseDetailsPage";
import SalesReportPage from "./pages/sale_report-pages/SalesReportPage";
import ProfitReportPage from "./pages/profit_report_pages/ProfitReportPage";
import StockReportPage from "./pages/stock_report_pages/StockReportPage";
import useAuth from "./hooks/useAuth";
import Users from "./pages/Users";
import StoreInfo from "./pages/settings_pages/StoreInfo";
import Expenses from "./pages/Expenses";

function App() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        <Route element={<DashboardLayout />}>
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/customers"
            element={
              <PrivateRoute>
                <Customers />
              </PrivateRoute>
            }
          />
          <Route
            path="/customers/create-customer"
            element={
              <PrivateRoute>
                <CustomerForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/customers/:id"
            element={
              <PrivateRoute>
                <CustomerDetailsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/products"
            element={
              <PrivateRoute>
                <Products />
              </PrivateRoute>
            }
          />
          <Route
            path="/products/create-products"
            element={
              <PrivateRoute>
                <ProductForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/products/edit-products/:id"
            element={
              <PrivateRoute>
                <ProductForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/products/:id"
            element={
              <PrivateRoute>
                <ProductDetailsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/categories"
            element={
              <PrivateRoute>
                <Categories />
              </PrivateRoute>
            }
          />
          <Route
            path="/categories/:id"
            element={
              <PrivateRoute>
                <CategoryDetailsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/categories/create-category"
            element={
              <PrivateRoute>
                <CategoryForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/categories/edit-category/:id"
            element={
              <PrivateRoute>
                <CategoryForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/brands"
            element={
              <PrivateRoute>
                <Brands />
              </PrivateRoute>
            }
          />
          <Route
            path="/brands/:id"
            element={
              <PrivateRoute>
                <BrandDetailsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/brands/create-brand"
            element={
              <PrivateRoute>
                <BrandForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/brands/edit-brand/:id"
            element={
              <PrivateRoute>
                <BrandForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <PrivateRoute>
                <Orders />
              </PrivateRoute>
            }
          />
          <Route
            path="/orders/:id"
            element={
              <PrivateRoute>
                <OrderDetailsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/suppliers"
            element={
              <PrivateRoute>
                <Suppliers />
              </PrivateRoute>
            }
          />
          <Route
            path="/suppliers/:id"
            element={
              <PrivateRoute>
                <SupplierDetailsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/suppliers/create-supplier"
            element={
              <PrivateRoute>
                <SupplierForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/suppliers/edit-supplier/:id"
            element={
              <PrivateRoute>
                <SupplierForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/purchases"
            element={
              <PrivateRoute>
                <Purchases />
              </PrivateRoute>
            }
          />
          <Route
            path="/purchases/:id"
            element={
              <PrivateRoute>
                <PurchaseDetailsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/purchases/create-purchase"
            element={
              <PrivateRoute>
                <PurchaseForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/purchases/edit-purchase/:id"
            element={
              <PrivateRoute>
                <PurchaseForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/pos"
            element={
              <PrivateRoute>
                <POS />
              </PrivateRoute>
            }
          />

          <Route
            path="/reports/sales"
            element={
              <PrivateRoute>
                <SalesReportPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/reports/profit"
            element={
              <PrivateRoute>
                <ProfitReportPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/reports/stock"
            element={
              <PrivateRoute>
                <StockReportPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/settings/users"
            element={
              <PrivateRoute>
                <Users />
              </PrivateRoute>
            }
          />
          <Route
            path="/settings/store"
            element={
              <PrivateRoute>
                <StoreInfo />
              </PrivateRoute>
            }
          />
          <Route
            path="/expenses"
            element={
              <PrivateRoute>
                <Expenses />
              </PrivateRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
