import { useState } from "react";
import { Package, Search, X } from "lucide-react"; // Iconos para mejorar la interfaz visualmente
import { Badge } from "../UI/Badge"; // Componente reutilizable para mostrar etiquetas con estilo
import { orderHistoryData } from "../data/HistoryData"; // Datos simulados del historial de pedidos

// Esta función recibe el estado del pedido (por ejemplo: entregado, cancelado, etc.)
// y devuelve una cadena de clases de Tailwind para darle color y estilo al Badge
const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case "entregado":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "cancelado":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    default:
      // En caso de que no sea ni entregado ni cancelado, usamos un color neutro
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  }
};

// Componente pequeño que formatea una fecha string a un formato legible en español
const FormatDate = ({ dateString }: { dateString: string }) => {
  const date = new Date(dateString);
  return (
    <span>
      {date.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })}
    </span>
  );
};

// Componente principal que representa el historial de pedidos
export function OrderHistory() {
  // Estado para almacenar lo que el usuario escribe en el campo de búsqueda
  const [searchTerm, setSearchTerm] = useState("");

  // Estado que indica qué filtro de estado está seleccionado (todos, entregado o cancelado)
  const [statusFilter, setStatusFilter] = useState("todos");

  // Este arreglo filtra los pedidos tomando en cuenta la búsqueda del usuario y el estado seleccionado
  const filteredOrders = orderHistoryData.filter((order) => {
    // Comparamos si lo escrito por el usuario aparece en alguno de estos campos del pedido
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.productos.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.repartidor.toLowerCase().includes(searchTerm.toLowerCase());

    // Validamos si el filtro de estado coincide o si se seleccionó "todos"
    const matchesStatus =
      statusFilter === "todos" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Título principal de la vista */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Historial de pedidos
        </h1>
      </div>

      {/* Contenedor principal con estilos y sombras */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        {/* Barra de búsqueda y filtro */}
        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Campo de búsqueda */}
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por número, cliente, producto o repartidor"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} // Cada vez que el usuario escribe, actualizamos el estado
              />
            </div>

            {/* Selector desplegable para elegir el estado del pedido */}
            <div className="relative w-full sm:w-48">
              <select
                className="block w-full pl-3 pr-8 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:outline-none focus:ring-primary focus:border-primary sm:text-sm appearance-none"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)} // Cambiamos el filtro según el valor seleccionado
              >
                <option value="todos">Todos los estados</option>
                <option value="entregado">Entregado</option>
                <option value="cancelado">Cancelado</option>
              </select>

              {/* Icono de flecha del selector */}
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Sección que muestra la lista de pedidos filtrados */}
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {/* Verificamos si hay resultados para mostrar */}
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <div key={order.id} className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between">
                  <div className="flex items-start gap-4 mb-2 sm:mb-0">
                    {/* Círculo con ícono de paquete */}
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                      <Package className="h-5 w-5 text-white" />
                    </div>

                    {/* Información detallada del pedido */}
                    <div>
                      <div className="flex items-center">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          {order.id}
                        </h3>

                        {/* Insignia que muestra el estado con color correspondiente */}
                        <Badge
                          className={`${getStatusBadgeColor(
                            order.status
                          )} capitalize ml-2`}
                        >
                          {order.status}
                        </Badge>
                      </div>

                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        <FormatDate dateString={order.date} /> • Repartidor:{" "}
                        {order.repartidor}
                      </p>

                      <p className="text-sm font-medium text-gray-900 dark:text-white mt-2">
                        Cliente: {order.cliente}
                      </p>

                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Productos: {order.productos}
                      </p>

                      {/* Si el pedido fue cancelado y tiene un motivo, lo mostramos aquí */}
                      {order.motivo && (
                        <div className="mt-2 flex items-start gap-1">
                          <X className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-red-600 dark:text-red-400">
                            Motivo de cancelación: {order.motivo}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            // Si no hay pedidos que coincidan, mostramos este mensaje
            <div className="p-6 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                No se encontraron pedidos que coincidan con tu búsqueda.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

