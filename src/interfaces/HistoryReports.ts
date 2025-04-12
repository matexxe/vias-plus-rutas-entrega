

export interface Report {
  id: string;
  title: string;
  type: "Ventas" | "Inventario" | "Entregas" | "Financiero";
  date: string;
  status: "Generado" | "En proceso" | "Error";
  description: string;
}

