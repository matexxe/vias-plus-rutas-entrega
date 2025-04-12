 /* Este componente representa la sección de configuración del sistema.
   Permite al administrador acceder a diferentes herramientas como notificaciones, historial de pedidos y
   reportes (en modo actualización o eliminación). */
import { useState } from "react";
import { configItems } from "../data/Config";
import { OrderHistory } from "../components/OrdenHistory";
import { Notifications } from "../components/Notifications";
import { Reports } from "../pages/HistoryReports";

export function Configuration() {
  // Estado para manejar qué componente se está mostrando actualmente
  const [activeComponent, setActiveComponent] = useState<string | null>(null);

  // Estado para definir si los reportes se están mostrando en modo "update" o "delete"
  const [reportsMode, setReportsMode] = useState<"update" | "delete">("update");

  // Maneja los clics en los botones de configuración
  const handleButtonClick = (title: string) => {
    // Configura el modo de los reportes y activa el componente correspondiente
    if (title === "Actualizar reportes") {
      setReportsMode("update");
      setActiveComponent("Reportes");
    } else if (title === "Eliminar reportes") {
      setReportsMode("delete");
      setActiveComponent("Reportes");
    } else {
      setActiveComponent(title);
    }
  };

  // Devuelve el componente correspondiente a la sección activa
  const renderActiveComponent = () => {
    switch (activeComponent) {
      case "Notificaciones":
        return <Notifications />;
      case "Historial de pedidos":
        return <OrderHistory />;
      case "Reportes":
        return <Reports mode={reportsMode} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Título principal */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Configuración
        </h1>
      </div>

      {/* Vista activa (ej. Notificaciones, Reportes, etc.) o tarjetas de selección */}
      {activeComponent ? (
        <div>
          {/* Botón para volver al menú principal */}
          <button
            onClick={() => setActiveComponent(null)}
            className="mb-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Volver
          </button>

          {/* Componente renderizado dinámicamente */}
          {renderActiveComponent()}
        </div>
      ) : (
        // Vista de tarjetas con las distintas configuraciones disponibles
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {configItems.map((item, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                {/* Encabezado de tarjeta con ícono y título */}
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-primary flex items-center justify-center">
                      <item.icon className="h-6 w-6 text-black dark:text-white" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {item.title}
                    </h3>
                  </div>
                </div>

                {/* Descripción de la tarjeta */}
                <div className="mt-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {item.description}
                  </p>
                </div>

                {/* Botón para acceder a la funcionalidad */}
                <div className="mt-6">
                  <button
                    onClick={() => handleButtonClick(item.title)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-black dark:text-white bg-primary hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer focus:ring-primary-500"
                  >
                    Acceder
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
