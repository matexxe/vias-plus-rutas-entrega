import {
  Users,
  FileText,
  Trash2,
  RefreshCw,
  Bell,
  Clock,
} from "lucide-react";

export const configItems = [
 
  {
    title: "Actualizar clientes",
    icon: Users,
    description: "Administrar datos de clientes",
  },
  {
    title: "Actualizar pedidos",
    icon: FileText,
    description: "Ver y modificar pedidos actuales",
  },
  {
    title: "Actualizar reportes",
    icon: RefreshCw,
    description: "Modificar informes existentes",
  },
  {
    title: "Eliminar reportes",
    icon: Trash2,
    description: "Borrar reportes obsoletos o incorrectos",
  },
  {
    title: "Notificaciones",
    icon: Bell,
    description: "Ver las últimas notificaciones de pedidos",
  },
  {
    title: "Historial de pedidos",
    icon: Clock,
    description:
      "Consulta entregas pasadas y evalúa la eficiencia del servicio.",
  },
];
