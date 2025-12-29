import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, UserPlus, LogOut, Package } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const { state } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const itemCount = state.items.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-green-600 text-white p-2 rounded-lg">
              <Heart className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold text-green-600">FarmaSaúde</span>
          </Link>

          {/* User Actions */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link 
                    to="/register-seller" 
                    className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors"
                  >
                    <UserPlus className="w-5 h-5" />
                    <span className="text-sm">Registrar Vendedor</span>
                  </Link>
                )}
                {(user.role === 'seller' || user.role === 'admin') && (
                  <Link
                    to="/seller-dashboard"
                    className="flex items-center gap-1 px-3 py-1 text-sm text-green-600 hover:text-green-700 transition-colors"
                  >
                    <Package className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                )}
                {user.role === 'customer' && (
                  <>
                    <Link
                      to="/my-orders"
                      className="flex items-center gap-1 px-3 py-1 text-sm text-green-600 hover:text-green-700 transition-colors"
                    >
                      <Package className="w-4 h-4" />
                      <span>Meus Pedidos</span>
                    </Link>
                    <Link 
                      to="/cart" 
                      className="relative p-2 text-gray-600 hover:text-green-600 transition-colors"
                    >
                      <ShoppingCart className="w-6 h-6" />
                      {itemCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                          {itemCount}
                        </span>
                      )}
                    </Link>
                  </>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700">Olá, {user.name}</span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1 text-gray-600 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="text-sm">Sair</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-green-600 transition-colors text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                >
                  Criar Conta
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;