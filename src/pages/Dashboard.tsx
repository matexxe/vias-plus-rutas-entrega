//Este componente es el dashboard que muestra las estadisticas de la aplicacion. 

import { Chart as ChartJS, CategoryScale, 
LinearScale, PointElement, LineElement, Title, Tooltip, Legend,ArcElement } from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";
import { stats } from "../data/Stats";
import { cn } from "../lib/Utils";
import { deliveryData, statusData } from "../data/DashboardData";

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
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 py-5 shadow"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Icon className="h-6 w-6 text-gray-400" />
                </div>
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
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
                  display: false,
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </div>

        <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
            Estado de pedidos
          </h3>
          <div className="h-64">
            <Doughnut
              data={statusData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
