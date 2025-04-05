// Aqui se define el formulario para registrar y editar conductores. 
import { useState, useRef, useEffect } from "react";

interface Driver {
  id?: number;
  name: string;
  vehicle: string;
  license: string;
  photo: string;
  deliveries: number;
  status: string;
  rating: number;
}

interface DriverFormProps {
  onClose: () => void;
  onSubmit: (driver: Driver) => void;
  driverToEdit?: Driver;
}

export default function DriverForm({
  onClose,
  onSubmit,
  driverToEdit,
}: DriverFormProps) {
  const [formData, setFormData] = useState<Driver>({
    name: "",
    vehicle: "",
    license: "",
    photo: "",
    deliveries: 0,
    status: "Disponible",
    rating: 0,
  });
  const [ratingError, setRatingError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (driverToEdit) {
      setFormData(driverToEdit);
    }
  }, [driverToEdit]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "rating") {
      const ratingValue = Number.parseFloat(value);
      if (isNaN(ratingValue) || ratingValue < 1 || ratingValue > 5) {
        setRatingError("La calificación debe ser un número entre 1 y 5");
      } else {
        setRatingError("");
      }
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          photo: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ratingValue = Number.parseFloat(formData.rating.toString());
    if (isNaN(ratingValue) || ratingValue < 1 || ratingValue > 5) {
      setRatingError("La calificación debe ser un número entre 1 y 5");
      return;
    }
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/20 dark:bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
        </button>

        <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
          {driverToEdit ? "Editar conductor" : "Agregar nuevo conductor"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-1"
              >
                Nombre
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label
                htmlFor="vehicle"
                className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-1"
              >
                Vehículo
              </label>
              <input
                type="text"
                id="vehicle"
                name="vehicle"
                value={formData.vehicle}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label
                htmlFor="license"
                className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-1"
              >
                Licencia
              </label>
              <input
                type="text"
                id="license"
                name="license"
                value={formData.license}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label
                htmlFor="deliveries"
                className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-1"
              >
                Entregas totales
              </label>
              <input
                type="text"
                id="deliveries"
                name="deliveries"
                value={formData.deliveries}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>

            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-1"
              >
                Estatus
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
              >
                <option value="Disponible">Disponible</option>
                <option value="En ruta">En ruta</option>
                <option value="Ocupado">Ocupado</option>
                <option value="Descanso">Descanso</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="rating"
                className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-1"
              >
                Calificación (1-5)
              </label>
              <input
                type="number"
                id="rating"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                min="1"
                max="5"
                step="0.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              {ratingError && (
                <p className="mt-1 text-sm text-white">{ratingError}</p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="photo"
              className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-1"
            >
              Foto de perfil
            </label>
            <input
              type="file"
              id="photo"
              name="photo"
              onChange={handlePhotoChange}
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
            />
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
              >
                Seleccionar foto
              </button>
              {formData.photo && (
                <img
                  src={formData.photo || "/placeholder.svg"}
                  alt="Preview"
                  className="w-20 h-20 object-cover rounded-full"
                />
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
            >
              {driverToEdit ? "Actualizar" : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
