import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, AlertCircle, User } from "lucide-react";
import { DriverForm } from "../registros/DriverForm";

interface OrderDriver {
  _id: string;
  articulo: string;
  descripcionPedido: string;
  conductor_id: string | null;
  estatus: "pendiente" | "en_progreso" | "entregado" | "cancelado";
  // otras propiedades del pedido...
}

interface Driver {
  _id: string;
  nombre: string;
  vehiculo: string;
  licencia: string;
  entregasTotales: number;
  estatus: "disponible" | "en_ruta" | "ocupado" | "descanso";
  calificacionPromedio: number;
}

export function Drivers() {
  const [showForm, setShowForm] = useState(false);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [driverToEdit, setDriverToEdit] = useState<Driver | undefined>(
    undefined
  );
  const [driverOrdersMap, setDriverOrdersMap] = useState<
    Record<string, OrderDriver[]>
  >({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Cargar conductores y sus pedidos
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Cargar conductores
        const driversResponse = await fetch(
          "http://localhost:5000/api/conductores"
        );
        if (!driversResponse.ok) throw new Error("Error al cargar conductores");
        const driversData = await driversResponse.json();
        setDrivers(driversData);

        // Cargar pedidos para cada conductor
        setLoadingOrders(true);
        const ordersMap: Record<string, OrderDriver[]> = {};

        await Promise.all(
          driversData.map(async (driver: Driver) => {
            const ordersResponse = await fetch(
              `http://localhost:5000/api/pedidos/conductor/${driver._id}`
            );
            if (ordersResponse.ok) {
              const orders = await ordersResponse.json();
              ordersMap[driver._id] = orders;
            }
          })
        );

        setDriverOrdersMap(ordersMap);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
        setLoadingOrders(false);
      }
    };

    fetchData();
  }, []);

  // Crear o actualizar conductor
  const handleAddOrUpdateDriver = async (driverData: Omit<Driver, "_id">) => {
    try {
      const method = driverToEdit ? "PUT" : "POST";
      const url = driverToEdit
        ? `http://localhost:5000/api/conductores/${driverToEdit._id}`
        : "http://localhost:5000/api/conductores";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(driverData),
      });

      if (!response.ok) {
        throw new Error(
          `Error al ${driverToEdit ? "actualizar" : "crear"} conductor`
        );
      }

      const updatedDriver = await response.json();
      setDrivers(
        driverToEdit
          ? drivers.map((d) =>
              d._id === updatedDriver._id ? updatedDriver : d
            )
          : [...drivers, updatedDriver]
      );
      setShowForm(false);
      setDriverToEdit(undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    }
  };

  // Eliminar conductor
  const handleDeleteDriver = async (driverId: string) => {
    if (!window.confirm("¿Eliminar este conductor?")) return;

    try {
      // Desasignar pedidos primero
      const driverOrders = driverOrdersMap[driverId] || [];
      if (driverOrders.length > 0) {
        await Promise.all(
          driverOrders.map((order) =>
            fetch(`http://localhost:5000/api/pedidos/${order._id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                conductor_id: null,
                estatus: "pendiente",
              }),
            })
          )
        );
      }

      // Eliminar conductor
      const response = await fetch(
        `http://localhost:5000/api/conductores/${driverId}`,
        { method: "DELETE" }
      );

      if (!response.ok) throw new Error("Error al eliminar conductor");

      // Actualizar estado
      setDrivers(drivers.filter((d) => d._id !== driverId));
      const newDriverOrdersMap = { ...driverOrdersMap };
      delete newDriverOrdersMap[driverId];
      setDriverOrdersMap(newDriverOrdersMap);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    }
  };

  if (loading) {
    return (
      <div className="container mt-4 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4 bg-red-50 border-l-4 border-red-500 p-4">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container -mt-2">
      <div className="space-y-6">
        {/* Encabezado y botón de agregar conductor */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Conductores
          </h1>
          <button
            className="inline-flex items-center px-4 py-2 border border-gray-400 shadow-sm text-sm font-medium rounded-md text-black dark:text-white 
          bg-primary hover:bg-primary-600 
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            onClick={() => setShowForm(true)}
          >
            <Plus className="h-5 w-5 mr-2" />
            Nuevo conductor
          </button>
        </div>

        {/* Lista de conductores */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {drivers.map((driver) => {
            const driverOrders = driverOrdersMap[driver._id] || [];

            return (
              <div
                key={driver._id}
                className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  {/* Encabezado del conductor */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                        <User className="h-full w-full text-gray-400 dark:text-gray-600" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          {driver.nombre}
                        </h3>
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            driver.estatus === "disponible"
                              ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                              : driver.estatus === "en_ruta"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
                              : driver.estatus === "ocupado"
                              ? "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
                          }`}
                        >
                          {driver.estatus === "disponible"
                            ? "Disponible"
                            : driver.estatus === "en_ruta"
                            ? "En ruta"
                            : driver.estatus === "ocupado"
                            ? "Ocupado"
                            : "Descanso"}
                        </span>
                      </div>
                    </div>
                    {/* Acciones: editar y eliminar */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setDriverToEdit(driver);
                          setShowForm(true);
                        }}
                        title="Editar conductor"
                        className="text-primary hover:text-primary-600"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteDriver(driver._id)}
                        title="Eliminar conductor"
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  {/* Detalles del conductor */}
                  <div className="mt-6">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-4">
                      <div>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Vehículo
                        </dt>
                        <dd className="text-sm text-gray-900 dark:text-white">
                          {driver.vehiculo}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Licencia
                        </dt>
                        <dd className="text-sm text-gray-900 dark:text-white">
                          {driver.licencia}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Entregas totales
                        </dt>
                        <dd className="text-sm text-gray-900 dark:text-white">
                          {driver.entregasTotales}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Calificación
                        </dt>
                        <dd className="text-sm text-gray-900 dark:text-white">
                          ⭐ {driver.calificacionPromedio.toFixed(1)}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  {/* Pedidos asignados */}
                  <div className="mt-4 border-t pt-4">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Pedidos asignados:
                    </h4>
                    {loadingOrders ? (
                      <div className="flex justify-center py-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary"></div>
                      </div>
                    ) : driverOrders.length > 0 ? (
                      <ul className="space-y-2">
                        {driverOrders.map((order) => (
                          <li key={order._id} className="text-sm">
                            <div className="flex justify-between items-center">
                              <span className="text-white">
                                {order.articulo}
                              </span>
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  order.estatus === "pendiente"
                                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
                                    : order.estatus === "en_progreso"
                                    ? "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
                                    : order.estatus === "entregado"
                                    ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                                    : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                                }`}
                              >
                                {order.estatus === "pendiente"
                                  ? "Pendiente"
                                  : order.estatus === "en_progreso"
                                  ? "En progreso"
                                  : order.estatus === "entregado"
                                  ? "Entregado"
                                  : "Cancelado"}
                              </span>
                            </div>
                            <div className="text-gray-500 dark:text-gray-400 text-xs">
                              {order.descripcionPedido}
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        No tiene pedidos asignados
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Formulario de conductor */}
      {showForm && (
        <DriverForm
          onClose={() => {
            setShowForm(false);
            setDriverToEdit(undefined);
          }}
          onSubmit={handleAddOrUpdateDriver}
          initialData={driverToEdit}
        />
      )}
    </div>
  );
}
