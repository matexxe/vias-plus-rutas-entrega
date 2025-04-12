export interface OrderDriver {
  id?: number;
  orderNumber: string;
  customerName: string;
  address: string;
  details: string;
  status: "Pendiente" | "En proceso" | "Entregado" | "Cancelado";
  driverId?: number;
}
