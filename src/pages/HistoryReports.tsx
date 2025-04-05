"use client";

import type React from "react";

import { useState } from "react";
import { Edit, Trash2, Download, FileText, X } from "lucide-react";

// Definimos la interfaz para los reportes
interface Report {
  id: string;
  title: string;
  type: "Ventas" | "Inventario" | "Entregas" | "Financiero";
  date: string;
  status: "Generado" | "En proceso" | "Error";
  description: string;
}

// Datos de ejemplo para los reportes
const initialReports: Report[] = [
  {
    id: "REP001",
    title: "Reporte de ventas mensual",
    type: "Ventas",
    date: "2023-06-01",
    status: "Generado",
    description:
      "Resumen de todas las ventas realizadas durante el mes de junio.",
  },
  {
    id: "REP002",
    title: "Inventario actual",
    type: "Inventario",
    date: "2023-06-15",
    status: "Generado",
    description:
      "Estado actual del inventario con productos agotados y disponibles.",
  },
  {
    id: "REP003",
    title: "Entregas pendientes",
    type: "Entregas",
    date: "2023-06-20",
    status: "En proceso",
    description: "Lista de entregas programadas para los próximos 7 días.",
  },
  {
    id: "REP004",
    title: "Balance Financiero",
    type: "Financiero",
    date: "2023-06-30",
    status: "Error",
    description: "Balance financiero del segundo trimestre del año.",
  },
];

interface ReportsProps {
  mode: "update" | "delete";
}

export default function Reports({ mode }: ReportsProps) {
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
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap"
              >
                ID
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap"
              >
                Título
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap"
              >
                Tipo
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap"
              >
                Fecha
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap"
              >
                Estado
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap"
              >
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredReports.map((report) => (
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
            ))}
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

interface ReportFormProps {
  onClose: () => void;
  onSubmit: (reportData: {
    title: string;
    type: "Ventas" | "Inventario" | "Entregas" | "Financiero";
    date: string;
    status: "Generado" | "En proceso" | "Error";
    description: string;
  }) => void;
  initialData?: {
    id?: string;
    title: string;
    type: "Ventas" | "Inventario" | "Entregas" | "Financiero";
    date: string;
    status: "Generado" | "En proceso" | "Error";
    description: string;
  };
}

function ReportForm({ onClose, onSubmit, initialData }: ReportFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    type:
      initialData?.type ||
      ("Ventas" as "Ventas" | "Inventario" | "Entregas" | "Financiero"),
    date: initialData?.date || new Date().toISOString().split("T")[0],
    status:
      initialData?.status ||
      ("En proceso" as "Generado" | "En proceso" | "Error"),
    description: initialData?.description || "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Título del reporte*
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <div>
          <label
            htmlFor="type"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Tipo de reporte*
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="Ventas">Ventas</option>
            <option value="Inventario">Inventario</option>
            <option value="Entregas">Entregas</option>
            <option value="Financiero">Financiero</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="date"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Fecha*
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Estado*
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="Generado">Generado</option>
            <option value="En proceso">En proceso</option>
            <option value="Error">Error</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Descripción
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          ></textarea>
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={onClose}
          className="mr-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Actualizar
        </button>
      </div>
    </form>
  );
}
