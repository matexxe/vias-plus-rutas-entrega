import { Order } from "../interfaces/Orders";

export const orders: Order[] = [
  {
    id: "001",
    cliente: "Juan Pérez",
    direccion: "Carrera 10 #20-30, Bogotá",
    estatus: "Pendiente",
    fecha: "2023-06-15",
    articulo: "Laptop Dell XPS 13",
    telefono: "310-123-4567",
    email: "juan.perez@example.com",
    detalles: "Entregar en horario de oficina",
  },
  {
    id: "002",
    cliente: "María González",
    direccion: "Calle 50 #12-45, Medellín",
    estatus: "En progreso",
    fecha: "2023-06-16",
    articulo: "iPhone 13 Pro",
    telefono: "311-234-5678",
    email: "maria.gonzalez@example.com",
    detalles: "Llamar antes de entregar",
  },
  {
    id: "003",
    cliente: "Carlos Rodríguez",
    direccion: "Avenida 68 #30-22, Cali",
    estatus: "Entregado/a",
    fecha: "2023-06-14",
    articulo: 'Monitor Samsung 27"',
    telefono: "312-345-6789",
    email: "carlos.rodriguez@example.com",
    detalles: "",
  },
];
