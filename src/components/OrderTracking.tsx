import { useState, useEffect } from "react"; // Importamos los estados y efectos de react
import { Search, Filter, MapPin, Package, Truck,  CheckCircle, AlertCircle, Clock } from "lucide-react"; // Iconos para mejorar la interfaz
import { ordersData as initialOrders, type Order } from "../data/OrdersData"; // Datos simulados que se obtienen en el archivo Data.
import OrderDetails from "../components/OrderDetails"; // Componente que muestra los detalles de un pedido especifico.

export function OrderTracking() {
  // Estados principales del componente
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(initialOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Simulación de actualizaciones automáticas de estado de pedidos
  useEffect(() => {
    const interval = setInterval(() => {
      setOrders((prevOrders) => {
        const newOrders = [...prevOrders];

        // Buscar pedidos "En tránsito" para posiblemente marcarlos como "Entregado"
        const transitOrders = newOrders.filter(
          (order) => order.status === "En tránsito"
        );
        if (transitOrders.length > 0) {
          const randomIndex = Math.floor(Math.random() * transitOrders.length);
          const orderToUpdate = transitOrders[randomIndex];

          // 10% de probabilidad de marcar como entregado
          if (Math.random() < 0.1) {
            const orderIndex = newOrders.findIndex(
              (o) => o.id === orderToUpdate.id
            );
            if (orderIndex !== -1) {
              newOrders[orderIndex] = {
                ...newOrders[orderIndex],
                status: "Entregado",
              };
            }
          }
        }

        // Buscar pedidos "En preparación" para posiblemente pasarlos a "En tránsito"
        const prepOrders = newOrders.filter(
          (order) => order.status === "En preparación"
        );
        if (prepOrders.length > 0 && Math.random() < 0.05) {
          const randomPrepIndex = Math.floor(Math.random() * prepOrders.length);
          const orderToUpdate = prepOrders[randomPrepIndex];
          const orderIndex = newOrders.findIndex(
            (o) => o.id === orderToUpdate.id
          );

          if (orderIndex !== -1) {
            // Asignar conductor aleatorio
            const driverIds = [1, 2, 3];
            const driverNames = ["Juan Pérez", "Luis Ramírez", "Miguel Torres"];
            const randomDriverIndex = Math.floor(
              Math.random() * driverIds.length
            );

            newOrders[orderIndex] = {
              ...newOrders[orderIndex],
              status: "En tránsito",
              driverId: driverIds[randomDriverIndex],
              driverName: driverNames[randomDriverIndex],
            };
          }
        }

        return newOrders;
      });
    }, 5000); // Cada 5 segundos

    return () => clearInterval(interval); // Limpieza del intervalo
  }, []);

  // Filtrado por búsqueda y estado
  useEffect(() => {
    let result = orders;

    // Filtro por estado
    if (statusFilter !== "all") {
      result = result.filter((order) => order.status === statusFilter);
    }

    // Filtro por término de búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (order) =>
          order.id.toString().includes(term) ||
          order.customer.name.toLowerCase().includes(term) ||
          order.address.street.toLowerCase().includes(term) ||
          order.address.city.toLowerCase().includes(term) ||
          order.businessType.toLowerCase().includes(term) ||
          (order.driverName && order.driverName.toLowerCase().includes(term))
      );
    }

    setFilteredOrders(result);
  }, [orders, searchTerm, statusFilter]);

  // Mostrar detalles del pedido seleccionado
  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowDetails(true);
  };

  // Icono por estado del pedido
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pendiente":
        return <Clock className="h-5 w-5" />;
      case "En preparación":
        return <Package className="h-5 w-5" />;
      case "En tránsito":
        return <Truck className="h-5 w-5" />;
      case "Entregado":
        return <CheckCircle className="h-5 w-5" />;
      case "Cancelado":
        return <AlertCircle className="h-5 w-5" />;
      default:
        return <Package className="h-5 w-5" />;
    }
  };

  // Color de fondo según estado del pedido
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pendiente":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100";
      case "En preparación":
        return "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100";
      case "En tránsito":
        return "bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100";
      case "Entregado":
        return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100";
      case "Cancelado":
        return "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
    }
  };

  // Formateo de fecha para visualización
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("es-MX", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="container px-4">
      {/* Título */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Seguimiento de pedidos
          </h1>
        </div>

        {/* Filtros de búsqueda y estado */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Búsqueda */}
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="Buscar por ID, cliente, dirección, tipo de negocio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filtro por estado */}
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Todos los estados</option>
              <option value="Pendiente">Pendiente</option>
              <option value="En preparación">En preparación</option>
              <option value="En tránsito">En tránsito</option>
              <option value="Entregado">Entregado</option>
              <option value="Cancelado">Cancelado</option>
            </select>
          </div>
        </div>

        {/* Tarjetas de pedidos */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleViewDetails(order)}
            >
              <div className="p-6">
                {/* Encabezado con estado y total */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div
                        className={`rounded-full p-2 ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusIcon(order.status)}
                      </div>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Pedido #{order.id}
                      </h3>
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    $
                    {order.total.toLocaleString("es-CO", {
                      minimumFractionDigits: 2,
                    })}
                  </div>
                </div>

                {/* Detalles del pedido */}
                <div className="mt-4">
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-4">
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                        <MapPin className="h-4 w-4 mr-1" /> Dirección
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                        {order.address.street}, {order.address.city}
                      </dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Cliente
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                        {order.customer.name}
                      </dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Tipo de negocio
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                        {order.businessType}
                      </dd>
                    </div>
                    {order.driverName && (
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Conductor
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                          {order.driverName}
                        </dd>
                      </div>
                    )}
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Creado
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                        {formatDate(order.createdAt)}
                      </dd>
                    </div>
                    {order.estimatedDelivery && (
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Entrega estimada
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                          {formatDate(order.estimatedDelivery)}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mensaje si no hay resultados */}
        {filteredOrders.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500 dark:text-gray-400">
              No se encontraron pedidos con los filtros actuales.
            </p>
          </div>
        )}
      </div>

      {/* Componente de detalles del pedido */}
      {showDetails && selectedOrder && (
        <OrderDetails
          order={selectedOrder}
          onClose={() => setShowDetails(false)}
          onStatusChange={(orderId, newStatus) => {
            setOrders((prevOrders) =>
              prevOrders.map((order) =>
                order.id === orderId ? { ...order, status: newStatus } : order
              )
            );
            setShowDetails(false);
          }}
        />
      )}
    </div>
  );
}
