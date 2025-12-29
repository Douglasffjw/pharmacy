import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Package, BarChart3, Users, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import * as authService from '../services/auth';

type AnyUser = any;

const SellerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [sellers, setSellers] = useState<AnyUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const openSellersModal = async () => {
    if (!user || (user.role !== 'admin' && user.role !== 'seller')) return;
    setShowModal(true);
    try {
      setLoading(true);
      const res = await authService.getUsers();
      const list: AnyUser[] = res.users || res;

      if (user.role === 'admin') {
        const onlySellers = list.filter(u => {
          const papel = (u.papel || u.role || '').toString().toLowerCase();
          return papel === 'vendedor' || papel === 'seller';
        });
        setSellers(onlySellers);
      } else {
        // seller: mostrar clientes
        const onlyCustomers = list.filter(u => {
          const papel = (u.papel || u.role || '').toString().toLowerCase();
          return papel === 'cliente' || papel === 'customer';
        });
        setSellers(onlyCustomers);
      }
    } catch (err) {
      console.error('Erro ao carregar usuários', err);
      setSellers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Confirma a exclusão deste vendedor?')) return;
    try {
      await authService.deleteSeller(id);
      setSellers(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      console.error('Erro ao excluir vendedor', err);
      alert('Falha ao excluir vendedor');
    }
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {user && user.role === 'admin' ? 'Dashboard do Administrador' : 'Dashboard do Vendedor'}
          </h1>
          <p className="text-gray-600">
            {user && user.role === 'admin' ? 'Gerencie vendedores, produtos e vendas' : 'Gerencie seus produtos e vendas'}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {user && user.role !== 'admin' && (
            <Link
              to="/create-product"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow group"
            >
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Plus className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-800 group-hover:text-green-600">
                    Novo Produto
                  </h3>
                  <p className="text-sm text-gray-600">
                    Cadastrar produto
                  </p>
                </div>
              </div>
            </Link>
          )}

          <Link
            to="/stock-management"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow group"
          >
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600">
                  Gestão de Estoque
                </h3>
                <p className="text-sm text-gray-600">
                  Controlar inventário
                </p>
              </div>
            </div>
          </Link>

          <Link
            to="/seller-sales"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow group"
          >
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-purple-600">
                  Ver Vendas
                </h3>
                <p className="text-sm text-gray-600">
                  Dashboard de vendas
                </p>
              </div>
            </div>
          </Link>

          <button
            onClick={openSellersModal}
            className="bg-white p-6 rounded-lg shadow-md text-left hover:shadow-lg transition-shadow group"
          >
            <div className="flex items-center">
              <div className="bg-orange-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {user && user.role === 'admin' ? 'Vendedores' : 'Clientes'}
                </h3>
                <p className="text-sm text-gray-600">
                  {user && user.role === 'admin' ? 'Ver e gerenciar vendedores' : 'Ver clientes'}
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            {user && user.role === 'admin' ? 'Bem-vindo ao Dashboard do Administrador!' : 'Bem-vindo ao Dashboard do Vendedor!'}
          </h2>
          <p className="text-gray-600 mb-4">
            Aqui você pode gerenciar todos os seus produtos e acompanhar suas vendas.
          </p>
          <p className="text-gray-600">
            Para começar, clique em "Novo Produto" para cadastrar seu primeiro produto.
          </p>
          {/* Sellers modal rendered below */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-start justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[80vh] overflow-auto">
                <div className="flex items-center justify-between p-4 border-b">
                  <h3 className="text-lg font-semibold">{user && user.role === 'admin' ? 'Vendedores' : 'Clientes'}</h3>
                  <button onClick={() => setShowModal(false)} className="text-gray-600 hover:text-gray-800">Fechar</button>
                </div>
                <div className="p-4">
                  {loading ? (
                    <p>Carregando...</p>
                  ) : sellers.length === 0 ? (
                    <p className="text-sm text-gray-600">{user && user.role === 'admin' ? 'Nenhum vendedor encontrado.' : 'Nenhum cliente encontrado.'}</p>
                  ) : (
                    <div className="space-y-2">
                      {sellers.map(s => (
                        <div key={s.id} className="flex items-center justify-between p-3 border rounded">
                          <div>
                            <div className="font-medium">{s.nome || s.name || s.email}</div>
                            <div className="text-sm text-gray-500">{s.email}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            {user && user.role === 'admin' ? (
                              <button
                                onClick={() => handleDelete(s.id)}
                                className="text-red-600 hover:text-red-800 flex items-center gap-1"
                              >
                                <Trash2 className="w-4 h-4" />
                                <span>Excluir</span>
                              </button>
                            ) : (
                              <span className="text-sm text-gray-500">Somente administradores podem excluir</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;