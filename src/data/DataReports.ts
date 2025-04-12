
import { Report } from "../interfaces/HistoryReports";

// Datos de ejemplo para los reportes
export const initialReports: Report[] = [
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
