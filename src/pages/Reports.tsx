import { useState, useEffect } from "react";
import { FileBarChart, Download, Loader2 } from "lucide-react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  fetchDeliveryPerformance,
  fetchAvailableReports,
  downloadPerformanceReport,
  downloadDriversReport,
} from "../service/reportService";
import {
  PerformanceData,
  AvailableReport,
  Conductor,
} from "../interfaces/Report";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const API_URL = "http://localhost:5000/api";

export function Reports() {
  const [performanceData, setPerformanceData] =
    useState<PerformanceData | null>(null);
  const [reports, setReports] = useState<AvailableReport[]>([]);
  const [conductores, setConductores] = useState<Conductor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    estado: "entregado",
    conductor: "",
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [conductoresResponse, performance, availableReports] =
          await Promise.all([
            fetch(`${API_URL}/conductores`),
            fetchDeliveryPerformance(filters),
            fetchAvailableReports(),
          ]);

        if (!conductoresResponse.ok)
          throw new Error("Error al cargar conductores");
        setConductores(await conductoresResponse.json());
        setPerformanceData(performance);
        setReports(availableReports);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [filters]);

  const handleDownload = async (reportId: string) => {
    try {
      setDownloading(reportId);
      if (reportId === "performance" && performanceData) {
        await downloadPerformanceReport(performanceData);
      } else if (reportId === "drivers") {
        const response = await fetch(`${API_URL}/conductores`);
        if (!response.ok) throw new Error("Error al obtener conductores");
        await downloadDriversReport(await response.json());
      } else {
        throw new Error("Tipo de reporte no soportado");
      }
    } catch (err) {
      console.error("Error al descargar:", err);
      alert(
        err instanceof Error ? err.message : "Error al descargar el reporte"
      );
    } finally {
      setDownloading(null);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Gráfico
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "#6b7280", 
          font: {
            size: 14,
          },
        },
      },
      tooltip: {
        bodyColor: "#1f2937",
        titleColor: "#1f2937", 
        backgroundColor: "#ffffff", 
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#6b7280"
        },
        grid: {
          display: false
        },
      },
      y: {
        ticks: {
          color: "#6b7280"
        },
        grid: {
          display: false, 
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <p className="mt-4 text-gray-600 dark:text-gray-300">
          Cargando reportes...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
        <h3 className="text-red-800 dark:text-red-200 font-medium">
          Error al cargar reportes
        </h3>
        <p className="text-red-600 dark:text-red-300 mt-2">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded hover:bg-red-200 dark:hover:bg-red-900/40"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 bg-white dark:bg-gray-900">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Reportes de entregas
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Visualiza y descarga reportes de desempeño
          </p>
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <select
            name="conductor"
            onChange={handleFilterChange}
            value={filters.conductor}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm 
              bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="" className="bg-white dark:bg-gray-800">
              Todos los conductores
            </option>
            {conductores.map((conductor) => (
              <option
                key={conductor._id}
                value={conductor._id}
                className="bg-white dark:bg-gray-800"
              >
                {conductor.nombre} - {conductor.vehiculo}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Gráfico de rendimiento */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              Rendimiento de entregas
            </h2>
            <button
              onClick={() => handleDownload("performance")}
              disabled={!performanceData || downloading === "performance"}
              className="flex items-center gap-1 px-3 py-1 text-sm rounded-md
                bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-white
                hover:bg-blue-100 dark:hover:bg-blue-900/40 disabled:opacity-50"
            >
              {downloading === "performance" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              Descargar
            </button>
          </div>

          {performanceData ? (
            <div
              className="h-80 
            [--chart-text:#1f2937] 
            [--chart-grid:rgba(0,0,0,0.1)] 
            [--chart-tooltip-bg:rgba(255,255,255,0.9)]"
            >
              <Bar data={performanceData} options={chartOptions} />
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center text-gray-500 dark:text-gray-400">
              No hay datos disponibles
            </div>
          )}
        </div>

        {/* Lista de reportes */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Reportes disponibles
          </h2>

          <div className="space-y-3">
            {reports.map((report) => (
              <div
                key={report._id}
                className="flex items-center justify-between p-4 rounded-lg border
                  bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600
                  hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <FileBarChart className="h-5 w-5 text-blue-500 dark:text-blue-400 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {report.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {report.description}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleDownload(report._id)}
                  disabled={downloading === report._id}
                  className="p-2 text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 disabled:opacity-50"
                  title="Descargar reporte"
                >
                  {downloading === report._id ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Download className="w-5 h-5" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
