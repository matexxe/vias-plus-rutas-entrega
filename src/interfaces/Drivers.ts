export interface Driver {
  _id: string;
  nombre: string;
  vehiculo: string;
  licencia: string;
  entregasTotales: number;
  estatus: "disponible" | "en_ruta" | "ocupado" | "descanso";
  calificacionPromedio: number;

 
}
