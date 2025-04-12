// Este componente representa el dashboard principal de la aplicación.
// Muestra estadísticas generales y gráficas como entregas semanales (gráfico de líneas) y estado de pedidos (gráfico de dona).

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";
import { stats } from "../data/Stats";
import { cn } from "../lib/Utils";
import { deliveryData, statusData } from "../data/DashboardData";

// Registro de los elementos necesarios para los gráficos de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Estadísticas generales (tarjetas en fila) */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 py-5 shadow"
            >
              <div className="flex items-center">
                {/* Icono de la estadística */}
                <div className="flex-shrink-0">
                  <Icon className="h-6 w-6 text-gray-400" />
                </div>

                {/* Nombre y valor de la estadística */}
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      {stat.name}
                    </dt>
                    <dd>
                      <div className="flex items-baseline">
                        <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                          {stat.value}
                        </p>
                        {/* Cambio porcentual (positivo o negativo) */}
                        <p
                          className={cn(
                            stat.changeType === "positive"
                              ? "text-green-600"
                              : "text-red-600",
                            "ml-2 flex items-baseline text-sm font-semibold"
                          )}
                        >
                          {stat.change}
                        </p>
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Gráficos del dashboard */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Gráfico de líneas: entregas semanales */}
        <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
            Entregas semanales
          </h3>
          <Line
            data={deliveryData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: false, // Oculta la leyenda
                },
              },
              scales: {
                y: {
                  beginAtZero: true, // El eje Y empieza desde cero
                },
              },
            }}
          />
        </div>

        {/* Gráfico de dona: estado actual de los pedidos */}
        <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
            Estado de pedidos
          </h3>
          <div className="h-64">
            <Doughnut
              data={statusData}
              options={{
                responsive: true,
                maintainAspectRatio: false, // Permite que el gráfico use toda la altura disponible
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
