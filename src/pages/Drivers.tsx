import { useState } from "react";
import { Plus, Edit, Package, Trash2 } from "lucide-react";
import { driversData as initialDrivers } from "../data/DriversData";
import { DriverForm } from "../registros/DriverForm";
import { OrderAsignarForm } from "../registros/OrderAsignar";
import { Driver } from "../interfaces/Drivers";
import { OrderDriver } from "../interfaces/OrderDriver";
import { sampleOrders } from "../data/SampleOrders";

// Página principal de gestión de conductores
export function Drivers() {
  // Estados para controlar visibilidad de formularios
  const [showForm, setShowForm] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);

  // Lista de conductores con rating
  const [drivers, setDrivers] = useState<Driver[]>(initialDrivers);


  // Estado para saber si estamos editando un conductor
  const [driverToEdit, setDriverToEdit] = useState<Driver | undefined>(
    undefined
  );

  // Estado para saber a qué conductor se le va a asignar un pedido
  const [selectedDriver, setSelectedDriver] = useState<Driver | undefined>(
    undefined
  );

  // Lista de pedidos actuales
  const [orders, setOrders] = useState<OrderDriver[]>(sampleOrders);

  // Pedido que se va a editar (si aplica)
  const [orderToEdit, setOrderToEdit] = useState<OrderDriver | undefined>(
    undefined
  );

  // Añadir o actualizar un conductor
  const handleAddOrUpdateDriver = (driverData: Driver) => {
    if (driverToEdit) {
      //  Actualiza solo el conductor cuyo id coincida
      setDrivers(
        drivers.map((d) =>
          d.id === driverToEdit.id ? { ...d, ...driverData } : d
        )
      );
      setDriverToEdit(undefined); // Limpiar el estado tras edición
    } else {
      // Agregar nuevo conductor
      const newDriver: Driver = {
        ...driverData,
        id: drivers.length + 1,
      };
      setDrivers([...drivers, newDriver]);
    }
    setShowForm(false); // Cerrar el formulario
  };

  // Prepara edición de conductor
  const handleEditDriver = (driver: Driver) => {
    setDriverToEdit(driver);
    setShowForm(true);
  };

  // Elimina conductor y desasigna pedidos relacionados
  const handleDeleteDriver = (driverId?: number) => {
    if (!driverId) return;

    if (
      window.confirm("¿Estás seguro de que deseas eliminar este conductor?")
    ) {
      setDrivers(drivers.filter((driver) => driver.id !== driverId));

      // Desasigna cualquier pedido relacionado al conductor eliminado
      setOrders(
        orders.map((order) =>
          order.driverId === driverId
            ? { ...order, driverId: undefined, status: "Pendiente" }
            : order
        )
      );
    }
  };

  // Inicia el proceso para asignar pedido a conductor
  const handleAssignOrder = (driver: Driver) => {
    setSelectedDriver(driver);
    setOrderToEdit(undefined);
    setShowOrderForm(true);
  };

  // Añadir o actualizar un pedido
  const handleAddOrUpdateOrder = (orderData: OrderDriver) => {
    if (orderToEdit) {
      // Actualiza pedido existente
      setOrders(
        orders.map((order) =>
          order.id === orderToEdit.id ? { ...order, ...orderData } : order
        )
      );
    } else {
      // Agrega nuevo pedido con ID y conductor asignado
      const newOrder: OrderDriver = {
        ...orderData,
        id: orders.length + 1,
        driverId: selectedDriver?.id,
      };
      setOrders([...orders, newOrder]);

      // Si el conductor estaba disponible, actualizar a "En ruta"
      if (selectedDriver && selectedDriver.status === "Disponible") {
        setDrivers(
          drivers.map((driver) =>
            driver.id === selectedDriver.id
              ? { ...driver, status: "En ruta" }
              : driver
          )
        );
      }
    }

    // Limpiar estados y cerrar formulario
    setShowOrderForm(false);
    setSelectedDriver(undefined);
    setOrderToEdit(undefined);
  };

  // Obtiene solo pedidos disponibles para asignar
  const getAvailableOrders = () => {
    return orders.filter(
      (order) =>
        !order.driverId &&
        order.status !== "Entregado" &&
        order.status !== "Cancelado"
    );
  };

  // Obtiene los pedidos asignados a un conductor específico
  const getDriverOrders = (driverId?: number) => {
    return orders.filter((order) => order.driverId === driverId);
  };

  return (
    <div className="container -mt-2">
      <div className="space-y-6">
        {/* Encabezado y botón para agregar conductor */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Conductores
          </h1>
          <button
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-black dark:text-white bg-primary hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            onClick={() => {
              setDriverToEdit(undefined);
              setShowForm(true);
            }}
          >
            <Plus className="h-5 w-5 mr-2" />
            Agregar un nuevo conductor
          </button>
        </div>

        {/* Lista de conductores */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {drivers.map((driver) => (
            <div
              key={driver.id}
              className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                {/* Información principal del conductor */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                      <img
                        src={driver.photo || "/placeholder.svg"}
                        alt={`${driver.name} profile`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {driver.name}
                      </h3>
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          driver.status === "Disponible"
                            ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                            : driver.status === "En ruta"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
                            : driver.status === "Ocupado"
                            ? "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
                        }`}
                      >
                        {driver.status}
                      </span>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleAssignOrder(driver)}
                      title="Asignar pedido"
                      className="text-primary hover:text-primary-600"
                    >
                      <Package className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleEditDriver(driver)}
                      title="Editar conductor"
                      className="text-primary hover:text-primary-600"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteDriver(driver.id)}
                      title="Eliminar conductor"
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Datos del conductor */}
                <div className="mt-6">
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-4">
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Vehículo
                      </dt>
                      <dd className="text-sm text-gray-900 dark:text-white">
                        {driver.vehicle}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Licencia
                      </dt>
                      <dd className="text-sm text-gray-900 dark:text-white">
                        {driver.license}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Entregas totales
                      </dt>
                      <dd className="text-sm text-gray-900 dark:text-white">
                        {driver.deliveries}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Calificación
                      </dt>
                      <dd className="text-sm text-gray-900 dark:text-white">
                        ⭐ {driver.rating}
                      </dd>
                    </div>
                  </dl>
                </div>

                {/* Lista de pedidos asignados */}
                {getDriverOrders(driver.id).length > 0 && (
                  <div className="mt-4 border-t pt-4">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Pedidos asignados:
                    </h4>
                    <ul className="space-y-2">
                      {getDriverOrders(driver.id).map((order) => (
                        <li key={order.id} className="text-sm">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">
                              {order.orderNumber}
                            </span>
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                order.status === "Pendiente"
                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
                                  : order.status === "En proceso"
                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
                                  : order.status === "Entregado"
                                  ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                                  : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                              }`}
                            >
                              {order.status}
                            </span>
                          </div>
                          <div className="text-gray-500 dark:text-gray-400">
                            {order.customerName} - {order.address}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal para formulario de conductor */}
      {showForm && (
        <DriverForm
          onClose={() => {
            setShowForm(false);
            setDriverToEdit(undefined);
          }}
          onSubmit={handleAddOrUpdateDriver}
          driverToEdit={driverToEdit}
        />
      )}

      {/* Modal para asignación de pedido */}
      {showOrderForm && selectedDriver && (
        <OrderAsignarForm
          onClose={() => {
            setShowOrderForm(false);
            setSelectedDriver(undefined);
            setOrderToEdit(undefined);
          }}
          onSubmit={handleAddOrUpdateOrder}
          driver={selectedDriver}
          orderToEdit={orderToEdit}
          availableOrders={getAvailableOrders()}
        />
      )}
    </div>
  );
}
