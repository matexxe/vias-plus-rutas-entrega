// Importaciones para manejo de clases condicionales en Tailwind CSS
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combina clases de Tailwind condicionalmente, eliminando conflictos.
 * Utiliza `clsx` para condicionar clases y `twMerge` para fusionar clases duplicadas.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Convierte minutos a un formato legible de horas y minutos.
 * @param minutes - Duración en minutos
 * @returns Formato como "Xh Ym"
 */
export function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = Math.round(minutes % 60);
  return `${hours}h ${remainingMinutes}m`;
}

/**
 * Valida los campos de una parada (stop).
 * Retorna errores si los campos requeridos están vacíos.
 * @param stop - Objeto con los datos de la parada
 * @returns Objeto con errores por campo (si los hay)
 */
export function validateStopInput(stop: {
  address: string;
  city: string;
  type: string;
  time: string;
}) {
  const errors: Record<string, string> = {};

  // Validación del campo de dirección
  if (!stop.address.trim()) {
    errors.address = "La dirección es requerida";
  }

  // Validación del campo de ciudad
  if (!stop.city.trim()) {
    errors.city = "La ciudad es requerida";
  }

  // Validación del tipo de parada
  if (!stop.type) {
    errors.type = "El tipo de parada es requerido";
  }

  // Validación de la hora
  if (!stop.time) {
    errors.time = "La hora es requerida";
  }

  return errors;
}

