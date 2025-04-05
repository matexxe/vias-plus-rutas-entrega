//Este componente es la pagina de reportes. 

import { FileBarChart, Download } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { reports } from '../data/Reports';
import { performanceData } from '../data/PerformanceData';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export function Reports() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Reportes</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
            Rendimiento de entregas
          </h2>
          <Bar
            data={performanceData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top' as const,
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

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
            Reportes disponibles
          </h2>
          <div className="space-y-4">
            {reports.map((report) => (
              <div
                key={report.name}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center">
                  <FileBarChart className="h-6 w-6 text-gray-400" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {report.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {report.description}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{report.date}</p>
                  </div>
                </div>
                <button className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 cursor-pointer">
                  <Download className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}