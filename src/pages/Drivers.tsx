
import { useState } from "react";
import { Plus, Edit, Package, Trash2 } from "lucide-react";
import { driversData as initialDrivers } from "../data/DriversData";
import DriverForm from "../registros/DriverForm";
import OrderAssignmentForm from "../registros/OrderAsignar";

// Tipado de los conductores. 
interface Driver {
  id?: number;
  name: string;
  vehicle: string;
  license: string;
  photo: string;
  deliveries: number;
  status: string;
  rating: number;
}
// Tipado  de los pedidos. 
interface Order {
  id?: number;
  orderNumber: string;
  customerName: string;
  address: string;
  details: string;
  status: "Pendiente" | "En proceso" | "Entregado" | "Cancelado";
  driverId?: number;
}

//Datos simulados de pedidos de muestra. 
const sampleOrders: Order[] = [
  {
    id: 1,
    orderNumber: "ORD-001",
    customerName: "Juan Pérez",
    address: "Calle Principal 123",
    details: "2 cajas grandes",
    status: "Pendiente",
  },
  {
    id: 2,
    orderNumber: "ORD-002",
    customerName: "María López",
    address: "Avenida Central 456",
    details: "Frágil, manipular con cuidado",
    status: "Pendiente",
  },
  {
    id: 3,
    orderNumber: "ORD-003",
    customerName: "Carlos Rodríguez",
    address: "Plaza Mayor 789",
    details: "Entrega urgente",
    status: "Pendiente",
  },
];
//Esta funcion es la escargada de mostrar la pagina de conductores. 
export function Drivers() {
  const [showForm, setShowForm] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [drivers, setDrivers] = useState<Driver[]>(
    initialDrivers.map((driver) => ({
      ...driver,
      rating: Number(driver.rating) || 0,
    }))
  );
  const [driverToEdit, setDriverToEdit] = useState<Driver | undefined>(
    undefined
  );
  const [selectedDriver, setSelectedDriver] = useState<Driver | undefined>(
    undefined
  );
  const [orders, setOrders] = useState<Order[]>(sampleOrders);
  const [orderToEdit, setOrderToEdit] = useState<Order | undefined>(undefined);

  const handleAddOrUpdateDriver = (driverData: Driver) => {
    if (driverToEdit) {
      // Actualiza un conductor existente. 
      setDrivers(
        drivers.map((driver) =>
          driver.id === driverToEdit.id ? { ...driver, ...driverData } : driver
        )
      );
      setDriverToEdit(undefined);
    } else {
      // Agrega un nuevo conductor. 
      const newDriver: Driver = {
        ...driverData,
        id: drivers.length + 1,
        rating: Number(driverData.rating) || 0,
      };
      setDrivers([...drivers, newDriver]);
    }
    setShowForm(false);
  };

  const handleEditDriver = (driver: Driver) => {
    setDriverToEdit(driver);
    setShowForm(true);
  };

  const handleDeleteDriver = (driverId?: number) => {
    if (!driverId) return;

    if (
      window.confirm("¿Estás seguro de que deseas eliminar este conductor?")
    ) {
      // Remove the driver
      setDrivers(drivers.filter((driver) => driver.id !== driverId));

      // Actualiza cualquier pedido asignado al conductor. 
      setOrders(
        orders.map((order) =>
          order.driverId === driverId
            ? { ...order, driverId: undefined, status: "Pendiente" }
            : order
        )
      );
    }
  };

  const handleAssignOrder = (driver: Driver) => {
    setSelectedDriver(driver);
    setOrderToEdit(undefined);
    setShowOrderForm(true);
  };

  const handleAddOrUpdateOrder = (orderData: Order) => {
    if (orderToEdit) {
      // Actualiza un pedido existente. 
      setOrders(
        orders.map((order) =>
          order.id === orderToEdit.id ? { ...order, ...orderData } : order
        )
      );
    } else {
      // Agrega un nuevo pedido. 
      const newOrder: Order = {
        ...orderData,
        id: orders.length + 1,
        driverId: selectedDriver?.id,
      };
      setOrders([...orders, newOrder]);

      // Actualiza el estado del conductor en ruta si esta disponible.
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
    setShowOrderForm(false);
    setSelectedDriver(undefined);
    setOrderToEdit(undefined);
  };

  // Verifica si un pedido puede ser asignado a un conductor. 
  const getAvailableOrders = () => {
    return orders.filter(
      (order) =>
        !order.driverId &&
        order.status !== "Entregado" &&
        order.status !== "Cancelado"
    );
  };

  // Asigna un pedido a un conductor. 
  const getDriverOrders = (driverId?: number) => {
    return orders.filter((order) => order.driverId === driverId);
  };

  return (
    <div className="container -mt-2">
      <div className="space-y-6">
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

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {drivers.map((driver) => (
            <div
              key={driver.id}
              className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                        <img
                          src={driver.photo || "/placeholder.svg"}
                          alt={`${driver.name} profile`}
                          className="h-full w-full object-cover"
                        />
                      </div>
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
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleAssignOrder(driver)}
                      className="text-primary hover:text-primary-600 focus:outline-none"
                      title="Asignar pedido"
                    >
                      <Package className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleEditDriver(driver)}
                      className="text-primary hover:text-primary-600 focus:outline-none"
                      title="Editar conductor"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteDriver(driver.id)}
                      className="text-red-500 hover:text-red-700 focus:outline-none"
                      title="Eliminar conductor"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="mt-6">
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-4">
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Vehículo
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                        {driver.vehicle}
                      </dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Licencia
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                        {driver.license}
                      </dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Entregas totales
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                        {driver.deliveries}
                      </dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Calificación
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                        ⭐ {Number(driver.rating).toFixed(1)}
                      </dd>
                    </div>
                  </dl>
                </div>

                {/* Asignar pedidos */}
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

      {showOrderForm && selectedDriver && (
        <OrderAssignmentForm
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
