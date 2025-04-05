
import { useState } from "react";
import { Search, Plus, Edit, Trash2 } from "lucide-react";
import { orders as initialOrders } from "../data/Orders";
import OrderForm from "../registros/OrderForm";
import { Order } from "../interfaces/Orders";


export default function Orders() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [orderToEdit, setOrderToEdit] = useState<Order | null>(null);

  // Filtrar pedidos según el término de búsqueda
  const filteredOrders = orders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.direccion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.articulo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Función para agregar un nuevo pedido
  const handleAddOrder = (orderData: Omit<Order, "id">) => {
    // Generar un ID único para el nuevo pedido
    const newId = (orders.length + 1).toString().padStart(3, "0");

    const newOrder: Order = {
      id: newId,
      ...orderData,
    };

    setOrders([...orders, newOrder]);
    setShowForm(false);
  };

  // Función para editar un pedido existente
  const handleEditOrder = (order: Order) => {
    setOrderToEdit(order);
    setShowForm(true);
  };

  // Función para actualizar un pedido existente
  const handleUpdateOrder = (updatedOrder: Order) => {
    setOrders(
      orders.map((order) =>
        order.id === updatedOrder.id ? updatedOrder : order
      )
    );
    setOrderToEdit(null);
    setShowForm(false);
  };

  // Función para eliminar un pedido
  const handleDeleteOrder = (orderId: string) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este pedido?")) {
      setOrders(orders.filter((order) => order.id !== orderId));
    }
  };

  return (
    <div className="space-y-6">
      {/* Título y Botón */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Pedidos
        </h1>
        <button
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-black dark:text-white bg-primary hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          onClick={() => {
            setOrderToEdit(null);
            setShowForm(true);
          }}
        >
          <Plus className="h-5 w-5 mr-2" />
          Agregar un nuevo pedido
        </button>
      </div>

      {/* Barra de Búsqueda */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar pedidos..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* Tabla de Pedidos */}
      <div className="bg-white dark:bg-gray-800 shadow overflow-x-auto sm:overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap"
              >
                ID
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap"
              >
                Cliente
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap"
              >
                Dirección
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap"
              >
                Estatus
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap"
              >
                Fecha
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap"
              >
                Artículo
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap"
              >
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredOrders.map((order) => (
              <tr
                key={order.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  #{order.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {order.cliente}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {order.direccion}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      order.estatus === "Entregado/a"
                        ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                        : order.estatus === "En progreso"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
                        : order.estatus === "Cancelado"
                        ? "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
                    }`}
                  >
                    {order.estatus}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {order.fecha}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {order.articulo}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEditOrder(order)}
                    className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200 mr-3"
                    title="Editar pedido"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteOrder(order.id)}
                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200"
                    title="Eliminar pedido"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Formulario Modal para Agregar/Editar Pedidos */}
      {showForm && (
        <OrderForm
          onClose={() => {
            setShowForm(false);
            setOrderToEdit(null);
          }}
          onSubmit={(orderData) => {
            if (orderToEdit) {
              handleUpdateOrder({
                ...orderToEdit,
                ...orderData,
              });
            } else {
              handleAddOrder(orderData);
            }
          }}
          initialData={orderToEdit || {} as Order}
        />
      )}
    </div>
  );
}
