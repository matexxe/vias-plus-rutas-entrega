export interface Order {
  id: string;
  cliente: string;
  direccion: string;
  estatus: "Pendiente" | "En progreso" | "Entregado/a" | "Cancelado";
  fecha: string;
  articulo: string;
  telefono: string;
  email: string;
  detalles: string;
}
