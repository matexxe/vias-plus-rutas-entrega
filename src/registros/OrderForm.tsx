// Aqui se define el formulario para crear y editar pedidos. 
import { useState, useEffect } from "react";
import { X } from "lucide-react";
// Aqui se define el formulario para crear pedidos.
interface OrderFormProps {
  onClose: () => void;
  onSubmit: (orderData: {
    cliente: string;
    direccion: string;
    estatus: "Pendiente" | "En progreso" | "Entregado/a" | "Cancelado" ;
    fecha: string;
    articulo: string;
    telefono: string;
    email: string;
    detalles: string;
  }) => void;
  // Aqui se editan los pedidos existentes. 
  initialData?: {
    id: string;
    cliente: string;
    direccion: string;
    estatus: "Pendiente" | "En progreso" | "Entregado/a" | "Cancelado";
    fecha: string;
    articulo: string;
    telefono?: string;
    email?: string;
    detalles?: string;
  };
}

export default function OrderForm({
  onClose,
  onSubmit,
  initialData,
}: OrderFormProps) {
  const [formData, setFormData] = useState({
    cliente: "",
    direccion: "",
    estatus: "Pendiente" as
      | "Pendiente"
      | "En progreso"
      | "Entregado/a"
      | "Cancelado",
    fecha: new Date().toISOString().split("T")[0], // Fecha actual en formato YYYY-MM-DD
    articulo: "",
    telefono: "",
    email: "",
    detalles: "",
  });

  // Cargar datos iniciales si se proporcionan (para edición)
  useEffect(() => {
    if (initialData) {
      setFormData({
        cliente: initialData.cliente || "",
        direccion: initialData.direccion || "",
        estatus: initialData.estatus || "Pendiente",
        fecha: initialData.fecha || new Date().toISOString().split("T")[0],
        articulo: initialData.articulo || "",
        telefono: initialData.telefono || "",
        email: initialData.email || "",
        detalles: initialData.detalles || "",
      });
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-white/30 dark:bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {initialData ? "Editar pedido" : "Agregar nuevo pedido"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label
                htmlFor="cliente"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Nombre del cliente*
              </label>
              <input
                type="text"
                id="cliente"
                name="cliente"
                value={formData.cliente}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <label
                htmlFor="telefono"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Teléfono de contacto*
              </label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Email*
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <label
                htmlFor="direccion"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Dirección de entrega*
              </label>
              <input
                type="text"
                id="direccion"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <label
                htmlFor="articulo"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Artículo/Producto*
              </label>
              <input
                type="text"
                id="articulo"
                name="articulo"
                value={formData.articulo}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <label
                htmlFor="fecha"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Fecha de entrega*
              </label>
              <input
                type="date"
                id="fecha"
                name="fecha"
                value={formData.fecha}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <label
                htmlFor="estatus"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Estatus*
              </label>
              <select
                id="estatus"
                name="estatus"
                value={formData.estatus}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="Pendiente">Pendiente</option>
                <option value="En progreso">En progreso</option>
                <option value="Entregado/a">Entregado/a</option>
                <option value="Cancelado">Cancelado</option>
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label
              htmlFor="detalles"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Detalles del pedido
            </label>
            <textarea
              id="detalles"
              name="detalles"
              value={formData.detalles}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Instrucciones especiales, detalles de entrega, etc."
            ></textarea>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {initialData ? "Actualizar" : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
