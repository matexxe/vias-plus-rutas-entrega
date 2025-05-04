import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface OrderFormProps {
  onClose: () => void;
  onSubmit: (orderData: {
    cliente_id: string;
    articulo: string;
    descripcionPedido: string;
    fechaEntrega: string;
    estatus: string;
    telefono: string;
    direccion: string;
    email: string;
    conductor_id?: string | null;
  }) => void;
  initialData?: {
    _id?: string;
    cliente_id: string;
    articulo: string;
    descripcionPedido: string;
    fechaEntrega: string;
    estatus: string;
    telefono: string;
    direccion: string;
    email: string;
    conductor_id?: string | null;
    conductor?: { _id: string; nombre: string };
  };
  drivers?: Array<{ _id: string; nombre: string }>;
}

export function OrderForm({
  onClose,
  onSubmit,
  initialData,
  drivers,
}: OrderFormProps) {
  const [formData, setFormData] = useState({
    cliente_id: "",
    articulo: "",
    descripcionPedido: "",
    fechaEntrega: "",
    estatus: "pendiente",
    telefono: "",
    direccion: "",
    email: "",
    conductor_id: null as string | null,
  });

useEffect(() => {
  if (initialData) {
    const fechaEntrega = initialData.fechaEntrega
      ? new Date(initialData.fechaEntrega).toISOString().slice(0, 16)
      : "";
    setFormData({
      cliente_id: initialData.cliente_id || "",
      articulo: initialData.articulo || "",
      descripcionPedido: initialData.descripcionPedido || "",
      fechaEntrega,
      estatus: initialData.estatus || "pendiente",
      telefono: initialData.telefono || "",
      direccion: initialData.direccion || "",
      email: initialData.email || "",
      conductor_id:
        initialData.conductor_id || initialData.conductor?._id || null,
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
    const dataToSubmit = {
      ...formData,
      conductor_id: formData.conductor_id || null,
    };
    onSubmit(dataToSubmit);
  };

  return (
    <div className="fixed inset-0 bg-white/30 dark:bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {initialData ? "Editar pedido" : "Crear nuevo pedido"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                ID cliente
              </label>
              <input
                type="text"
                name="cliente_id"
                value={formData.cliente_id}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Artículo
              </label>
              <input
                type="text"
                name="articulo"
                value={formData.articulo}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Descripción
              </label>
              <textarea
                name="descripcionPedido"
                value={formData.descripcionPedido}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Fecha de entrega
              </label>
              <input
                type="datetime-local"
                name="fechaEntrega"
                value={formData.fechaEntrega}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Estatus
              </label>
              <select
                name="estatus"
                value={formData.estatus}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="pendiente">Pendiente</option>
                <option value="en_progreso">En progreso</option>
                <option value="entregado">Entregado</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Teléfono
              </label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Dirección
              </label>
              <input
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            {/* Campo "Asignar a conductor" solo se muestra al editar */}
            {initialData && drivers && drivers.length > 0 && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Asignar a conductor
                </label>
                <select
                  name="conductor_id"
                  value={formData.conductor_id || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData((prev) => ({
                      ...prev,
                      conductor_id: value ? value : null,
                    }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">No asignado</option>
                  {drivers.map((driver) => (
                    <option key={driver._id} value={driver._id}>
                      {driver.nombre}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <div className="mt-6 flex justify-end space-x-3">
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
              {initialData ? "Actualizar pedido" : "Crear pedido"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
