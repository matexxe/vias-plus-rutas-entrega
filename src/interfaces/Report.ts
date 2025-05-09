
// Tipos para los datos de rendimiento
export interface PerformanceData {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
   
    }[];
  }
  
  // Tipo para los filtros de reportes
  export interface ReportFilters {
    conductor?: string;
    limit?: string;
    estado?: string;
    sort?: string;
    fechaInicio?: string;
    fechaFin?: string;
  }
  
  // Tipo para los reportes disponibles
  export interface ReportAvailable {
    _id: string;
    name: string;
    description: string;
    createdAt: Date | string;
    type?: string;
  }
  
  // Tipo para los datos de pedidos (según tu backend)
  export interface Pedido {
    _id: string;
  cliente_id: string | { _id: string };
  articulo: string;
  descripcionPedido: string;
  fechaEntrega: string;
  estatus: string;
  telefono: string;
  direccion: string;
  email: string;
  conductor_id?: string | null;
  conductor?: { _id: string; nombre: string };
}
  
  
  
  // Tipo para los conductores
  export interface Conductor {
    _id: string;
    nombre: string;
    vehiculo: string;
    licencia: string;
    entregasTotales: number;
    estatus: "disponible" | "en_ruta" | "ocupado" | "descanso";
    calificacionPromedio: number;
  }
