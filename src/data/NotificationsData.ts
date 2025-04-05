// Datos de ejemplo para las notificaciones.
import { Notification } from "../interfaces/Interfaces";

export const notificationsData: Notification[] = [
  {
    id: 1,
    type: "entrega",
    title: "Entrega completada",
    message:
      "Carlos hizo entrega del pedido a Farmacia San Juan. 20 paquetes de paracetamol, 10 cajas de ibuprofeno.",
    date: "2023-12-18T14:30:00",
    read: false,
  },
  {
    id: 2,
    type: "entrega",
    title: "Entrega completada",
    message:
      "Ana entregó el pedido a Farmacia Central. 15 cajas de amoxicilina, 5 cajas de loratadina.",
    date: "2023-12-15T10:15:00",
    read: true,
  },
  {
    id: 3,
    type: "cancelacion",
    title: "Pedido cancelado",
    message:
      "Miguel reportó cancelación del pedido para Farmacia El Bosque. Motivo: Cliente cerrado al momento de la entrega.",
    date: "2023-12-10T09:45:00",
    read: false,
  },
  {
    id: 4,
    type: "ruta",
    title: "Ruta optimizada",
    message:
      "Se ha optimizado la ruta para 5 entregas en la zona norte. Tiempo estimado: 2 horas.",
    date: "2023-12-08T16:20:00",
    read: true,
  },
  {
    id: 5,
    type: "entrega",
    title: "Entrega completada",
    message:
      "Carlos entregó el pedido a Farmacia Bienestar. 25 cajas de omeprazol, 10 cajas de metformina.",
    date: "2023-12-05T11:30:00",
    read: true,
  },
  {
    id: 6,
    type: "cancelacion",
    title: "Pedido cancelado",
    message:
      "Ana reportó cancelación del pedido para Farmacia La Salud. Motivo: Pedido incompleto, cliente rechazó la entrega.",
    date: "2023-12-01T13:45:00",
    read: false,
  },
];