import { useState, useEffect } from "react";
import { Search, Plus, Edit, Trash2, AlertCircle } from "lucide-react";
import { OrderForm } from "../registros/OrderForm";

interface Order {
  _id: string;
  cliente_id: string | { _id: string };
  articulo: string;
  descripcionPedido: string;
  fechaEntrega: string;
  estatus: string;
  telefono: string;
  direccion: string;
  email: string;
  conductor_id?: string | null;
  conductor?: { _id: string; nombre: string };
}

interface Driver {
  _id: string;
  nombre: string;
}

export function Orders() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        "http://localhost:5000/api/pedidos?populate=conductor_id"
      );
      if (!response.ok) throw new Error("Error al cargar pedidos");

      const data = await response.json();

      const formattedOrders = data.map((order: any) => ({
        ...order,
        conductor: order.conductor_id
          ? { _id: order.conductor_id._id, nombre: order.conductor_id.nombre }
          : undefined,
      }));

      setOrders(formattedOrders);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar pedidos");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      await fetchOrders();
      const driversRes = await fetch("http://localhost:5000/api/conductores");
      if (driversRes.ok) setDrivers(await driversRes.json());
    };
    loadInitialData();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const searchTermLower = searchTerm.toLowerCase();
    const fieldsToSearch = [
      order.articulo,
      order.descripcionPedido,
      order.estatus,
      order.telefono,
      order.direccion,
      order.email,
      order.conductor?.nombre || "",
    ];
    return fieldsToSearch.some(
      (field) => field?.toLowerCase().includes(searchTermLower) ?? false
    );
  });

  const handleDeleteOrder = async (orderId: string) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/pedidos/${orderId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Error al eliminar el pedido");
      setOrders(orders.filter((order) => order._id !== orderId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al eliminar pedido");
    }
  };

  const handleAddOrder = async (orderData: Omit<Order, "_id">) => {
    try {
      const response = await fetch("http://localhost:5000/api/pedidos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...orderData,
          conductor_id: orderData.conductor_id || null,
        }),
      });

      if (!response.ok) throw new Error("Error al crear el pedido");

      const newOrder = await response.json();

      if (newOrder.conductor_id) {
        const driver = drivers.find((d) => d._id === newOrder.conductor_id);
        newOrder.conductor = driver
          ? { _id: driver._id, nombre: driver.nombre }
          : undefined;
      }

      setOrders([...orders, newOrder]);
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear pedido");
    }
  };

  const handleUpdateOrder = async (orderData: Omit<Order, "_id">) => {
    if (!editingOrder?._id) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/pedidos/${editingOrder._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...orderData,
            conductor_id: orderData.conductor_id || null,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al actualizar el pedido");
      }

      const updatedOrder = await response.json();

      const driver = orderData.conductor_id
        ? drivers.find((d) => d._id === orderData.conductor_id)
        : undefined;

      const updatedOrderWithDriver = {
        ...updatedOrder,
        conductor: driver
          ? { _id: driver._id, nombre: driver.nombre }
          : undefined,
      };

      setOrders(
        orders.map((order) =>
          order._id === editingOrder._id ? updatedOrderWithDriver : order
        )
      );

      setShowForm(false);
      setEditingOrder(null);
    } catch (err) {
      console.error("Error al actualizar pedido:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Error desconocido al actualizar pedido"
      );
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pendiente":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100";
      case "en_progreso":
        return "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100";
      case "asignado":
        return "bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100";
      case "entregado":
        return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100";
      case "cancelado":
        return "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-red-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Pedidos
        </h1>
        <div className="flex space-x-2">
          <button
            className="inline-flex items-center px-4 py-2 border border-gray-400 shadow-sm text-sm font-medium rounded-md text-black dark:text-white 
            bg-primary hover:bg-primary-600 
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            onClick={() => setShowForm(true)}
          >
            <Plus className="h-5 w-5 mr-2" />
            Nuevo pedido
          </button>
        </div>
      </div>
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
      {filteredOrders.length > 0 ? (
        <div className="bg-white dark:bg-gray-800 shadow overflow-x-auto sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Artículo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Descripción
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Fecha Entrega
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Estatus
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Conductor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
              {filteredOrders.map((order) => (
                <tr
                  key={order._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {order.articulo}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                    {order.descripcionPedido}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(order.fechaEntrega).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                        order.estatus
                      )}`}
                    >
                      {order.estatus.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {order.conductor?.nombre || "No asignado"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setEditingOrder(order);
                          setShowForm(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200"
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteOrder(order._id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200"
                        title="Eliminar"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              No se encontraron pedidos
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {searchTerm
                ? "No hay pedidos que coincidan con tu búsqueda."
                : "No hay pedidos registrados en el sistema."}
            </p>
          </div>
        </div>
      )}
      {showForm && (
        <OrderForm
          onClose={() => {
            setShowForm(false);
            setEditingOrder(null);
          }}
          onSubmit={(orderData) => {
            if (editingOrder) {
              handleUpdateOrder({
                ...orderData,
                conductor_id: orderData.conductor_id ?? null,
                estatus: orderData.estatus as Order["estatus"],
              });
            } else {
              handleAddOrder({
                ...orderData,
                conductor_id: orderData.conductor_id ?? null,
                estatus: orderData.estatus as Order["estatus"],
              });
            }
          }}
          initialData={
            editingOrder
              ? {
                  ...editingOrder,
                  telefono: editingOrder.telefono || "",
                  direccion: editingOrder.direccion || "",
                  email: editingOrder.email || "",
                }
              : undefined
          }
          drivers={drivers}
        />
      )}
    </div>
  );
}
