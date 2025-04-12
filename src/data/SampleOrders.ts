import { OrderDriver } from "../interfaces/OrderDriver";

//Datos simulados de pedidos de muestra.
export const sampleOrders: OrderDriver[] = [
  {
    id: 1,
    orderNumber: "ORD-001",
    customerName: "Juan Pérez",
    address: "Calle Principal 123",
    details: "2 cajas grandes",
    status: "Pendiente",
  },
  {
    id: 2,
    orderNumber: "ORD-002",
    customerName: "María López",
    address: "Avenida Central 456",
    details: "Frágil, manipular con cuidado",
    status: "Pendiente",
  },
  {
    id: 3,
    orderNumber: "ORD-003",
    customerName: "Carlos Rodríguez",
    address: "Plaza Mayor 789",
    details: "Entrega urgente",
    status: "Pendiente",
  },
];
