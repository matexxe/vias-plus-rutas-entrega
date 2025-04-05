// Importaciones para la función cn
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Función para combinar clases CSS de manera condicional
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Tus funciones existentes
export function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = Math.round(minutes % 60)
  return `${hours}h ${remainingMinutes}m`
}

export function validateStopInput(stop: {
  address: string
  city: string
  type: string
  time: string
}) {
  const errors: Record<string, string> = {}

  if (!stop.address.trim()) {
    errors.address = "La dirección es requerida"
  }

  if (!stop.city.trim()) {
    errors.city = "La ciudad es requerida"
  }

  if (!stop.type) {
    errors.type = "El tipo de parada es requerido"
  }

  if (!stop.time) {
    errors.time = "La hora es requerida"
  }

  return errors
}