
import { useState } from "react";
import { Edit, Trash2, Download, FileText, X } from "lucide-react";
import { Report } from "../interfaces/HistoryReports";
import { initialReports } from "../data/DataReports";
import { ReportForm } from "../components/ReportForm";

interface ReportsProps {
  mode: "update" | "delete";
}

export function Reports({ mode }: ReportsProps) {
  const [reports, setReports] = useState<Report[]>(initialReports);
  const [showForm, setShowForm] = useState(false);
  const [reportToEdit, setReportToEdit] = useState<Report | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Filtrar reportes según el término de búsqueda
  const filteredReports = reports.filter(
    (report) =>
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Función para editar un reporte existente
  const handleEditReport = (report: Report) => {
    setReportToEdit(report);
    setShowForm(true);
  };

  // Función para actualizar un reporte existente
  const handleUpdateReport = (updatedReport: Report) => {
    setReports(
      reports.map((report) =>
        report.id === updatedReport.id ? updatedReport : report
      )
    );
    setReportToEdit(null);
    setShowForm(false);
  };

  // Función para eliminar un reporte
  const handleDeleteReport = (reportId: string) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este reporte?")) {
      setReports(reports.filter((report) => report.id !== reportId));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {mode === "update" ? "Actualizar reportes" : "Eliminar reportes"}
        </h2>
      </div>

      {/* Barra de Búsqueda */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar reportes..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FileText className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* Tabla de Reportes */}
      <div className="bg-white dark:bg-gray-800 shadow overflow-x-auto sm:overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500
                 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap"
              >
                ID
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500
                 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap"
              >
                Título
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500
                 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap"
              >
                Tipo
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500
                 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap"
              >
                Fecha
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500
                 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap"
              >
                Estado
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500
                 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap"
              >
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredReports.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="p-6 text-center text-gray-500 dark:text-gray-400"
                >
                  No se encontraron reportes que coincidan con tu búsqueda.
                </td>
              </tr>
            ) : (
              filteredReports.map((report) => (
                <tr
                  key={report.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {report.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {report.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {report.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {report.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        report.status === "Generado"
                          ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                          : report.status === "En proceso"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
                          : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                      }`}
                    >
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      {mode === "update" && (
                        <button
                          onClick={() => handleEditReport(report)}
                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200"
                          title="Editar reporte"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteReport(report.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200"
                        title="Eliminar reporte"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      {report.status === "Generado" && (
                        <button
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-200"
                          title="Descargar reporte"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Formulario Modal para Editar Reportes */}
      {showForm && (
        <div className="fixed inset-0 bg-white/30 dark:bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Editar reporte
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setReportToEdit(null);
                }}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <ReportForm
              onClose={() => {
                setShowForm(false);
                setReportToEdit(null);
              }}
              onSubmit={(reportData) => {
                if (reportToEdit) {
                  handleUpdateReport({
                    ...reportToEdit,
                    ...reportData,
                  });
                }
              }}
              initialData={reportToEdit || undefined}
            />
          </div>
        </div>
      )}
    </div>
  );
}
