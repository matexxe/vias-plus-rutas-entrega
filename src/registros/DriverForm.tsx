import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface DriverFormProps {
  onClose: () => void;
  onSubmit: (driverData: {
    nombre: string;
    vehiculo: string;
    licencia: string;
    entregasTotales: number;
    estatus: "disponible" | "en_ruta" | "ocupado" | "descanso";
    calificacionPromedio: number;
    // foto?: string; // No se enviará
  }) => void;
  initialData?: {
    _id?: string;
    nombre: string;
    vehiculo: string;
    licencia: string;
    entregasTotales: number;
    estatus: "disponible" | "en_ruta" | "ocupado" | "descanso";
    calificacionPromedio: number;
    foto?: string;
  };
}

export function DriverForm({
  onClose,
  onSubmit,
  initialData,
}: DriverFormProps) {
  const [formData, setFormData] = useState({
    nombre: "",
    vehiculo: "",
    licencia: "",
    entregasTotales: 0,
    estatus: "disponible" as "disponible" | "en_ruta" | "ocupado" | "descanso",
    calificacionPromedio: 5,
    foto: "",
  });

  const [ratingError, setRatingError] = useState("");
 

  useEffect(() => {
    if (initialData) {
      setFormData({
        nombre: initialData.nombre,
        vehiculo: initialData.vehiculo,
        licencia: initialData.licencia,
        entregasTotales: initialData.entregasTotales,
        estatus: initialData.estatus,
        calificacionPromedio: initialData.calificacionPromedio,
        foto: localStorage.getItem("driverPhoto") || initialData.foto || "",
      });
    } else {
      const localPhoto = localStorage.getItem("driverPhoto");
      if (localPhoto) {
        setFormData((prev) => ({ ...prev, foto: localPhoto }));
      }
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "calificacionPromedio") {
      const rating = parseFloat(value);
      if (isNaN(rating)) {
        setRatingError("La calificación debe ser un número");
        return;
      }
      if (rating < 1 || rating > 5) {
        setRatingError("La calificación debe estar entre 1 y 5");
        return;
      }
      setRatingError("");
    }

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "entregasTotales" || name === "calificacionPromedio"
          ? parseFloat(value) || 0
          : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ratingError) return;

    // Excluir la propiedad 'foto' antes de enviar
    const { foto, ...dataToSend } = formData;
    onSubmit(dataToSend);
  };

  return (
    <div className="fixed inset-0 bg-black/20 dark:bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
          {initialData ? "Editar conductor" : "Agregar nuevo conductor"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nombre
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            {/* Vehículo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Vehículo
              </label>
              <input
                type="text"
                name="vehiculo"
                value={formData.vehiculo}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            {/* Licencia */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Licencia
              </label>
              <input
                type="text"
                name="licencia"
                value={formData.licencia}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            {/* Entregas Totales */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Entregas totales
              </label>
              <input
                type="number"
                name="entregasTotales"
                value={formData.entregasTotales}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            {/* Estatus */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Estatus
              </label>
              <select
                name="estatus"
                value={formData.estatus}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="disponible">Disponible</option>
                <option value="en_ruta">En ruta</option>
                <option value="ocupado">Ocupado</option>
                <option value="descanso">Descanso</option>
              </select>
            </div>

            {/* Calificación Promedio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Calificación promedio (1-5)
              </label>
              <input
                type="number"
                name="calificacionPromedio"
                value={formData.calificacionPromedio}
                onChange={handleChange}
                min="1"
                max="5"
                step="0.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              {ratingError && (
                <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                  {ratingError}
                </p>
              )}
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-primary hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {initialData ? "Actualizar" : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
