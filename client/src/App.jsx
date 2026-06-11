import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import AuthLayout from "./layouts/AuthLayout.jsx";
import DashboardLayout from "./layouts/DashboardLayout.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import Products from "./pages/product_pages/Products.jsx";
import ProductForm from "./pages/product_pages/ProductForm.jsx";
import Categories from "./pages/category_pages/Categories.jsx";
import Brands from "./pages/brand_pages/Brands.jsx";
import BrandDetailsPage from "./pages/brand_pages/BrandDetailsPage.jsx";
import CategoryDetailsPage from "./pages/category_pages/CategoryDetailsPage.jsx";
import BrandForm from "./pages/brand_pages/BrandForm.jsx";
import CategoryForm from "./pages/category_pages/CategoryForm.jsx";
import ProductDetailsPage from "./pages/product_pages/ProductDetailsPage.jsx";
import Orders from "./pages/order_pages/Orders.jsx";
import OrderDetailsPage from "./pages/order_pages/OrderDetailsPage.jsx";
import POS from "./pages/POS.jsx";
import CustomerForm from "./pages/customer_pages/CustomerForm.jsx";
import Customers from "./pages/customer_pages/Customers.jsx";
import CustomerDetailsPage from "./pages/customer_pages/CustomerDetailsPage.jsx";
import SupplierForm from "./pages/supplier_pages/SupplierForm.jsx";
import Suppliers from "./pages/supplier_pages/Suppliers.jsx";
import SupplierDetailsPage from "./pages/supplier_pages/SupplierDetailsPage.jsx";
import PurchaseForm from "./pages/purchase_pages/PurchaseForm.jsx";
import Purchases from "./pages/purchase_pages/Purchases.jsx";
import PurchaseDetailsPage from "./pages/purchase_pages/PurchaseDetailsPage.jsx";
import SalesReportPage from "./pages/sale_report-pages/SalesReportPage.jsx";
import ProfitReportPage from "./pages/profit_report_pages/ProfitReportPage.jsx";
import StockReportPage from "./pages/stock_report_pages/StockReportPage.jsx";
import useAuth from "./hooks/useAuth.js";
import Users from "./pages/Users.jsx";
import StoreInfo from "./pages/settings_pages/StoreInfo.jsx";
import Expenses from "./pages/Expenses.jsx";
import { useContext } from "react";
import { ThemeContext } from "./context/ThemeContext.jsx";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import getTheme from "./theme.js";

function App() {
  const { user } = useAuth();

  const { mode } = useContext(ThemeContext);

  function same(arr1, arr2) {
    let result = [];
    for (let item1 of arr1) {
      result.push(item1 * item1);
    }

    const isEqual =
      result.length === arr2.length &&
      JSON.stringify([...result].sort()) === JSON.stringify([...arr2].sort());

    console.log(result, arr2);

    return isEqual;
  }

  console.log(same([2, 3, 6], [9, 4, 36]));

  return (
    <MuiThemeProvider theme={getTheme(mode)}>
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
    </MuiThemeProvider>
  );
}

export default App;
