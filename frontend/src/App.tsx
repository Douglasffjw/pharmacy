import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CategoryPage from './pages/CategoryPage';
import CreateProductPage from './pages/CreateProductPage';
import SellerDashboard from './pages/SellerDashboard';
import { LoginPage } from './pages/LoginPage';
import { RegisterCustomerPage } from './pages/RegisterCustomerPage';
import { RegisterSellerPage } from './pages/RegisterSellerPage';
import PrivateRoute from './components/PrivateRoute';
import { WelcomePage } from './pages/WelcomePage';
import CheckoutPage from './pages/CheckoutPage';
import MyOrdersPage from './pages/MyOrdersPage';
import SellerSalesPage from './pages/SellerSalesPage';
import StockManagementPage from './pages/StockManagementPage';
import DebugCartPage from './pages/DebugCartPage';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Header />
            <Routes>
              <Route path="/" element={<WelcomePage />} />
              <Route path="/products" element={
                <PrivateRoute>
                  <HomePage />
                </PrivateRoute>
              } />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterCustomerPage />} />
              <Route path="/register-seller" element={
                  <PrivateRoute allowedRoles={['seller', 'admin']}>
                  <RegisterSellerPage />
                </PrivateRoute>
              } />
              <Route path="/product/:id" element={
                <PrivateRoute>
                  <ProductDetailPage />
                </PrivateRoute>
              } />
              <Route path="/category/:categoryId" element={
                <PrivateRoute>
                  <CategoryPage />
                </PrivateRoute>
              } />
              <Route path="/create-product" element={
                  <PrivateRoute allowedRoles={['seller', 'admin']}>
                  <CreateProductPage />
                </PrivateRoute>
              } />
              <Route path="/seller-dashboard" element={
                  <PrivateRoute allowedRoles={['seller', 'admin']}>
                  <SellerDashboard />
                </PrivateRoute>
              } />
              <Route path="/seller-sales" element={
                  <PrivateRoute allowedRoles={['seller', 'admin']}>
                  <SellerSalesPage />
                </PrivateRoute>
              } />
              <Route path="/stock-management" element={
                  <PrivateRoute allowedRoles={['seller', 'admin']}>
                  <StockManagementPage />
                </PrivateRoute>
              } />
              <Route 
                path="/cart" 
                element={
                  <PrivateRoute allowedRoles={['customer']}>
                    <CartPage />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/checkout" 
                element={
                  <PrivateRoute allowedRoles={['customer']}>
                    <CheckoutPage />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/my-orders" 
                element={
                  <PrivateRoute allowedRoles={['customer']}>
                    <MyOrdersPage />
                  </PrivateRoute>
                } 
              />
              <Route path="/debug-cart" element={<DebugCartPage />} />
            </Routes>
            <footer className="bg-white text-center text-sm text-gray-600 py-4">
              © 2026 Todos os direitos reservados a Douglas Freitas
            </footer>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;