export interface Order {
  _id: string;
  cliente_id: string;
  conductor_id: string | null;
  articulo: string;
  descripcionPedido: string;
  fechaEntrega: string;
  estatus: "pendiente" | "en_progreso" | "asignado" | "entregado" | "cancelado";
  telefono: string;
  direccion: string;
  email: string;
  conductor?: {
    _id: string;
    nombre: string;
  };
  createdAt?: string;
  updatedAt?: string;
}
