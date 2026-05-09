import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';
import PrivateRoute from './components/PrivateRoute';
import Customers from './pages/Customers';
import Products from './pages/Product_pages/Products';
import Categories from './pages/category_pages/Categories';
import Brands from './pages/brand_pages/Brands';
import Orders from './pages/Orders';

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route element={<AuthLayout />}>
					<Route
						path='/login'
						element={<Login />}
					/>
					<Route
						path='/register'
						element={<Register />}
					/>
				</Route>
				<Route element={<DashboardLayout />}>
					<Route
						path='/dashboard'
						element={
							<PrivateRoute>
								<Dashboard />
							</PrivateRoute>
						}
					/>
					<Route
						path='/customers'
						element={
							<PrivateRoute>
								<Customers />
							</PrivateRoute>
						}
					/>
					<Route
						path='/products'
						element={
							<PrivateRoute>
								<Products />
							</PrivateRoute>
						}
					/>
					<Route
						path='/categories'
						element={
							<PrivateRoute>
								<Categories />
							</PrivateRoute>
						}
					/>
					<Route
						path='/brands'
						element={
							<PrivateRoute>
								<Brands />
							</PrivateRoute>
						}
					/>
					<Route
						path='/orders'
						element={
							<PrivateRoute>
								<Orders />
							</PrivateRoute>
						}
					/>
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
