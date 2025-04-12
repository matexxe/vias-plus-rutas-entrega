export interface ReportFormProps {
  onClose: () => void;
  onSubmit: (reportData: {
    title: string;
    type: "Ventas" | "Inventario" | "Entregas" | "Financiero";
    date: string;
    status: "Generado" | "En proceso" | "Error";
    description: string;
  }) => void;
  initialData?: {
    id?: string;
    title: string;
    type: "Ventas" | "Inventario" | "Entregas" | "Financiero";
    date: string;
    status: "Generado" | "En proceso" | "Error";
    description: string;
  };
}
