// Interfaces de datos de pedido y clientes. 
export interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  customer: {
    name: string;
    phone: string;
    email: string;
  };
  address: {
    street: string;
    city: string;
    zipCode: string;
  };
  businessType: string; // Nuevo campo para el tipo de negocio
  items: OrderItem[];
  total: number;
  status:
    | "Pendiente"
    | "En preparación"
    | "En tránsito"
    | "Entregado"
    | "Cancelado";
  driverId?: number;
  driverName?: string;
  createdAt: string;
  estimatedDelivery?: string;
  notes?: string;
}

// Reemplazar los datos de muestra con datos colombianos
export const ordersData: Order[] = [
  {
    id: 1001,
    customer: {
      name: "Carlos Gómez",
      phone: "+57 315 123 4567",
      email: "carlos.gomez@example.com",
    },
    address: {
      street: "Calle 93 #11-30",
      city: "Bogotá",
      zipCode: "110221",
    },
    businessType: "Farmacia",
    items: [
      {
        id: 1,
        name: "Medicamento Paracetamol 500mg",
        quantity: 1,
        price: 35000,
      },
      { id: 2, name: "Seguro de envío", quantity: 1, price: 5000 },
    ],
    total: 40000,
    status: "En tránsito",
    driverId: 1,
    driverName: "Juan Martínez",
    createdAt: "2023-11-15T10:30:00",
    estimatedDelivery: "2023-11-15T12:30:00",
    notes: "Entregar en recepción",
  },
  {
    id: 1002,
    customer: {
      name: "María Rodríguez",
      phone: "+57 300 987 6543",
      email: "maria.rodriguez@example.com",
    },
    address: {
      street: "Carrera 7 #82-10",
      city: "Medellín",
      zipCode: "050022",
    },
    businessType: "Restaurante",
    items: [
      { id: 3, name: "Combo Hamburguesa Clásica", quantity: 2, price: 20000 },
      { id: 4, name: "Embalaje especial", quantity: 1, price: 7500 },
    ],
    total: 47500,
    status: "Pendiente",
    createdAt: "2023-11-15T11:15:00",
    estimatedDelivery: "2023-11-15T14:30:00",
  },
  {
    id: 1003,
    customer: {
      name: "Roberto Herrera",
      phone: "+57 310 456 7890",
      email: "roberto.herrera@example.com",
    },
    address: {
      street: "Avenida El Poblado #43-20",
      city: "Medellín",
      zipCode: "050021",
    },
    businessType: "Tienda de ropa",
    items: [
      { id: 5, name: "Camiseta Negra Talla M", quantity: 3, price: 10000 },
      { id: 6, name: "Entrega express", quantity: 1, price: 12000 },
    ],
    total: 42000,
    status: "En preparación",
    createdAt: "2023-11-15T09:45:00",
    estimatedDelivery: "2023-11-15T13:00:00",
    notes: "Llamar antes de entregar",
  },
  {
    id: 1006,
    customer: {
      name: "Javier Duarte",
      phone: "+57 317 345 6789",
      email: "javier.duarte@example.com",
    },
    address: {
      street: "Calle 5 #45-20",
      city: "Cali",
      zipCode: "760001",
    },
    businessType: "Librería",
    items: [
      {
        id: 11,
        name: "Libro 'Cien Años de Soledad'",
        quantity: 2,
        price: 10000,
      },
      { id: 12, name: "Entrega express", quantity: 1, price: 12000 },
    ],
    total: 32000,
    status: "Cancelado",
    createdAt: "2023-11-14T16:45:00",
    estimatedDelivery: "2023-11-14T19:00:00",
    notes: "Cliente canceló el pedido",
  },
  {
    id: 1007,
    customer: {
      name: "Lucía Fernández",
      phone: "+57 319 987 6543",
      email: "lucia.fernandez@example.com",
    },
    address: {
      street: "Calle 50 #20-15",
      city: "Pereira",
      zipCode: "660001",
    },
    businessType: "Joyería",
    items: [
      { id: 17, name: "Collar de Plata 925", quantity: 1, price: 120000 },
      { id: 18, name: "Estuche de Regalo", quantity: 1, price: 10000 },
    ],
    total: 130000,
    status: "En tránsito",
    driverId: 4,
    driverName: "Fernando López",
    createdAt: "2023-11-16T09:00:00",
    estimatedDelivery: "2023-11-16T12:00:00",
  },
  {
    id: 1008,
    customer: {
      name: "Mario Gutiérrez",
      phone: "+57 312 456 7891",
      email: "mario.gutierrez@example.com",
      
    },
    address: {
      street: "Avenida Principal #100-50",
      city: "Cúcuta",
      zipCode: "540001",
    },
    businessType: "Electrónica",
    items: [
      { id: 19, name: "Auriculares Inalámbricos", quantity: 1, price: 150000 },
      { id: 20, name: "Cargador Rápido USB-C", quantity: 1, price: 50000 },
    ],
    total: 200000,
    status: "Pendiente",
    createdAt: "2023-11-16T14:30:00",
    estimatedDelivery: "2023-11-16T18:00:00",
  },
];