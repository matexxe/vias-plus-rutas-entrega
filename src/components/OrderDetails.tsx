
import { useState } from "react"; // Libreria para manejar estados.
import { MapPin, User, Phone, Mail, Package, Truck, Clock, X } from "lucide-react"; // Iconos de Lucide
import { Order } from "../data/OrdersData"; // Importa el tipo de dato para los pedidos.

// Props que recibe el componente
interface OrderDetailsProps {
  order: Order; // Pedido a mostrar
  onClose: () => void; // Función para cerrar el modal
  onStatusChange: (
    orderId: number,
    newStatus:
      | "Pendiente"
      | "En preparación"
      | "En tránsito"
      | "Entregado"
      | "Cancelado"
  ) => void; // Función para actualizar el estado del pedido
}
// Componente que muestra los detalles de un pedido. 
export default function OrderDetails({
  order,
  onClose,
  onStatusChange,
}: OrderDetailsProps) {
  // Estado local para el nuevo estado seleccionado
  const [newStatus, setNewStatus] = useState<
    "Pendiente" | "En preparación" | "En tránsito" | "Entregado" | "Cancelado"
  >(order.status);

  // Formatea fecha para que se muestre como día/mes/año y hora:minutos
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

  // Retorna una clase de Tailwind según el estado para mostrar colores apropiados
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

  // Función para aplicar el cambio de estado
  const handleStatusChange = () => {
    onStatusChange(order.id, newStatus);
  };

  return (
    <div className="fixed inset-0 bg-white/30 dark:bg-black/50 flex items-center justify-center z-50 p-4">
      {/* Contenedor del modal */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Encabezado con título y botón de cerrar */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Detalles del pedido #{order.id}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="h-6 w-6 cursor-pointer" />
            </button>
          </div>

          {/* Cuerpo del modal dividido en dos columnas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Columna izquierda: info del pedido y cliente */}
            <div>
              {/* Info del pedido */}
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Información del pedido
              </h3>
              <div className="space-y-4">
                {/* Estado */}
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Estado
                  </p>
                  <p
                    className={`mt-1 px-3 py-1 inline-flex text-sm font-semibold rounded-full ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </p>
                </div>

                {/* Fecha de creación */}
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Fecha de creación
                  </p>
                  <p className="mt-1 text-gray-900 dark:text-white flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {formatDate(order.createdAt)}
                  </p>
                </div>

                {/* Entrega estimada, si aplica */}
                {order.estimatedDelivery && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Entrega estimada
                    </p>
                    <p className="mt-1 text-gray-900 dark:text-white flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {formatDate(order.estimatedDelivery)}
                    </p>
                  </div>
                )}

                {/* Nombre del conductor, si hay */}
                {order.driverName && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Conductor asignado
                    </p>
                    <p className="mt-1 text-gray-900 dark:text-white flex items-center">
                      <Truck className="h-4 w-4 mr-1" />
                      {order.driverName}
                    </p>
                  </div>
                )}

                {/* Notas adicionales */}
                {order.notes && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Notas
                    </p>
                    <p className="mt-1 text-gray-900 dark:text-white">
                      {order.notes}
                    </p>
                  </div>
                )}
              </div>

              {/* Información del cliente */}
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mt-6 mb-4">
                Información del cliente
              </h3>
              <div className="space-y-4">
                {/* Nombre */}
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Nombre
                  </p>
                  <p className="mt-1 text-gray-900 dark:text-white flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {order.customer.name}
                  </p>
                </div>

                {/* Teléfono */}
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Teléfono
                  </p>
                  <p className="mt-1 text-gray-900 dark:text-white flex items-center">
                    <Phone className="h-4 w-4 mr-1" />
                    {order.customer.phone}
                  </p>
                </div>

                {/* Email */}
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Email
                  </p>
                  <p className="mt-1 text-gray-900 dark:text-white flex items-center">
                    <Mail className="h-4 w-4 mr-1" />
                    {order.customer.email}
                  </p>
                </div>

                {/* Dirección */}
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Dirección
                  </p>
                  <p className="mt-1 text-gray-900 dark:text-white flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {order.address.street}, {order.address.city}, CP{" "}
                    {order.address.zipCode}
                  </p>
                </div>
              </div>
            </div>

            {/* Columna derecha: artículos y actualización de estado */}
            <div>
              {/* Artículos del pedido */}
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Artículos del pedido
              </h3>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="space-y-4">
                  {/* Itera los artículos del pedido */}
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center"
                    >
                      <div className="flex items-center">
                        <Package className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Cantidad: {item.quantity} x ${item.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        ${(item.quantity * item.price).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Total del pedido */}
                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
                  <div className="flex justify-between items-center">
                    <p className="text-base font-medium text-gray-900 dark:text-white">
                      Total
                    </p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      ${order.total.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Sección para actualizar el estado */}
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Actualizar estado
                </h3>
                <div className="mt-6 flex flex-col space-y-4">
                  {/* Selector de estado */}
                  <div>
                    <label
                      htmlFor="status"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Actualizar estado
                    </label>
                    <div className="mt-1">
                      <select
                        id="status"
                        value={newStatus}
                        onChange={(e) =>
                          setNewStatus(
                            e.target.value as
                              | "Pendiente"
                              | "En preparación"
                              | "En tránsito"
                              | "Entregado"
                              | "Cancelado"
                          )
                        }
                        className="block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      >
                        <option value="Pendiente">Pendiente</option>
                        <option value="En preparación">En preparación</option>
                        <option value="En tránsito">En tránsito</option>
                        <option value="Entregado">Entregado</option>
                      </select>
                    </div>
                  </div>

                  {/* Botones para aplicar cambios o cancelar pedido */}
                  <div className="flex space-x-3">
                    <button
                      onClick={handleStatusChange}
                      className="flex-1 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                      Actualizar estado
                    </button>
                    <button
                      onClick={() => {
                        setNewStatus("Cancelado");
                        onStatusChange(order.id, "Cancelado");
                      }}
                      className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Cancelar pedido
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
