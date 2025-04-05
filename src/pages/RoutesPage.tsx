
//Este componente es la pagina de rutas de la paginacion donde maneja la api de openStreetMap.
import { useState, useEffect, useRef } from "react";
import { RotateCw, Plus, Trash2, AlertCircle } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import { translations } from "../Traduccion/Translations";

// Leaflet icon workaround
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png",
});

interface Stop {
  id: string;
  address: string;
  city: string;
  type: "store" | "restaurant" | "pharmacy" | "supermarket";
  time: string;
  coordinates: [number, number];
}

interface RouteDetails {
  totalDistance: number;
  totalTime: number;
  stops: number;
  isCalculating: boolean;
  error?: string;
  instructions?: string[];
}

interface Location {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
}

function translateRouteInstructions(instruction: string): string {
  // Reemplazar palabras y frases conocidas
  let translatedText = instruction;

  // Ordenar las claves por longitud (de mayor a menor) para evitar reemplazos parciales
  const sortedKeys = Object.keys(translations).sort(
    (a, b) => b.length - a.length
  );

  for (const key of sortedKeys) {
    // Usar expresión regular para coincidir con la palabra completa y preservar mayúsculas/minúsculas
    const regex = new RegExp(`\\b${key}\\b`, "gi");
    translatedText = translatedText.replace(regex, (match) => {
      // Preservar mayúsculas/minúsculas
      if (match === match.toUpperCase()) return translations[key].toUpperCase();
      if (match[0] === match[0].toUpperCase()) {
        return translations[key][0].toUpperCase() + translations[key].slice(1);
      }
      return translations[key];
    });
  }

  return translatedText;
}

export function Routes() {
  const [stops, setStops] = useState<Stop[]>([]);
  const [newStop, setNewStop] = useState({
    address: "",
    city: "",
    type: "store" as Stop["type"],
    time: "",
  });
  const [inputErrors, setInputErrors] = useState<Record<string, string>>({});
  const [routeDetails, setRouteDetails] = useState<RouteDetails>({
    totalDistance: 0,
    totalTime: 0,
    stops: 0,
    isCalculating: false,
    instructions: [],
  });
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);

  const mapRef = useRef<L.Map | null>(null);
  const routingControlRef = useRef<L.Routing.Control | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    const getUserLocation = async () => {
      try {
        const response = await fetch("https://ipapi.co/json/");
        const data = await response.json();

        if (data.latitude && data.longitude) {
          const location: Location = {
            latitude: data.latitude,
            longitude: data.longitude,
            address: data.city,
            city: data.region,
          };
          setUserLocation(location);

          if (!mapRef.current) {
            mapRef.current = L.map("map").setView(
              [location.latitude, location.longitude],
              13
            );
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
              attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            }).addTo(mapRef.current);

            // Add CSS to fix z-index issues with Leaflet controls
            const style = document.createElement("style");
            style.textContent = `
              .leaflet-control { z-index: 0 !important; }
              .leaflet-pane { z-index: 0 !important; }
              .leaflet-top, .leaflet-bottom { z-index: 0 !important; }
            `;
            document.head.appendChild(style);

            userMarkerRef.current = L.marker(
              [location.latitude, location.longitude],
              {
                icon: L.divIcon({
                  className: "user-location-marker",
                  html: '<div class="w-6 h-6 rounded-full bg-blue-500 border-2 border-white shadow-lg flex items-center justify-center text-white text-xs">📍</div>',
                  iconSize: [24, 24],
                  iconAnchor: [12, 24],
                }),
              }
            )
              .addTo(mapRef.current)
              .bindPopup("Tu ubicación actual");
          }
        }
      } catch (error) {
        console.error("Error getting user location:", error);
        if (!mapRef.current) {
          mapRef.current = L.map("map").setView([4.5709, -74.2973], 6);
          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          }).addTo(mapRef.current);
        }
      } finally {
        setIsLoadingLocation(false);
      }
    };

    getUserLocation();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  const validateStopInput = (stop: typeof newStop) => {
    const errors: Record<string, string> = {};
    if (!stop.address.trim()) errors.address = "La dirección es requerida";
    if (!stop.city.trim()) errors.city = "La ciudad es requerida";
    if (!stop.time) errors.time = "La hora es requerida";
    return errors;
  };

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}m`;
  };

  const addStop = async () => {
    const errors = validateStopInput(newStop);
    setInputErrors(errors);

    if (Object.keys(errors).length === 0) {
      try {
        setRouteDetails((prev) => ({
          ...prev,
          isCalculating: true,
          error: undefined,
        }));
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            `${newStop.address}, ${newStop.city}, Colombia`
          )}&limit=1`
        );
        const data = await response.json();

        if (data && data.length > 0) {
          const { lat, lon } = data[0];
          const newStopWithCoordinates: Stop = {
            id: crypto.randomUUID(),
            ...newStop,
            coordinates: [Number(lat), Number(lon)],
          };

          setStops((prev) => [...prev, newStopWithCoordinates]);
          setNewStop({
            address: "",
            city: "",
            type: "store",
            time: "",
          });
          setInputErrors({});

          if (mapRef.current) {
            mapRef.current.setView([Number(lat), Number(lon)], 13);
          }
        } else {
          setRouteDetails((prev) => ({
            ...prev,
            error:
              "No se pudo encontrar la dirección. Por favor, verifique e intente de nuevo.",
          }));
        }
      } catch (error) {
        setRouteDetails((prev) => ({
          ...prev,
          error: "Error al procesar la dirección. Por favor, intente de nuevo.",
        }));
      } finally {
        setRouteDetails((prev) => ({ ...prev, isCalculating: false }));
      }
    }
  };

  const removeStop = (id: string) => {
    setStops((prev) => prev.filter((stop) => stop.id !== id));
    if (routingControlRef.current && mapRef.current) {
      mapRef.current.removeControl(routingControlRef.current);
      routingControlRef.current = null;
    }
  };

  const calculateRoute = async () => {
    if (!userLocation) {
      setRouteDetails((prev) => ({
        ...prev,
        error: "No se pudo detectar tu ubicación actual.",
      }));
      return;
    }

    if (mapRef.current && stops.length > 0) {
      setRouteDetails((prev) => ({
        ...prev,
        isCalculating: true,
        error: undefined,
      }));

      try {
        if (routingControlRef.current) {
          mapRef.current.removeControl(routingControlRef.current);
        }

        const waypoints = [
          L.latLng(userLocation.latitude, userLocation.longitude),
          ...stops.map((stop) =>
            L.latLng(stop.coordinates[0], stop.coordinates[1])
          ),
        ];

        routingControlRef.current = L.Routing.control({
          waypoints,
          routeWhileDragging: true,
          showAlternatives: true,
          fitSelectedRoutes: true,
          lineOptions: {
            styles: [{ color: "#6366F1", weight: 6 }],
            extendToWaypoints: true,
            missingRouteTolerance: 1,
          },
        }).addTo(mapRef.current);

        routingControlRef.current.on("routesfound", (e) => {
          const routes = e.routes[0];
          // Traducir las instrucciones
          const instructions = routes.instructions.map((instruction: any) =>
            translateRouteInstructions(instruction.text)
          );
          setRouteDetails({
            totalDistance: routes.summary.totalDistance / 1000, // Convert to km
            totalTime: routes.summary.totalTime / 60, // Convert to minutes
            stops: stops.length,
            isCalculating: false,
            instructions,
          });
        });
      } catch (error) {
        setRouteDetails((prev) => ({
          ...prev,
          isCalculating: false,
          error: "Error al calcular la ruta. Por favor, intente de nuevo.",
        }));
      }
    } else {
      setRouteDetails((prev) => ({
        ...prev,
        error: "Agrega al menos una parada para calcular la ruta.",
      }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Optimización de rutas en Colombia
        </h1>
        <button
          onClick={calculateRoute}
          disabled={
            stops.length === 0 ||
            routeDetails.isCalculating ||
            isLoadingLocation
          }
          className={`flex items-center px-4 py-2 rounded-md text-white ${
            stops.length === 0 ||
            routeDetails.isCalculating ||
            isLoadingLocation
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {routeDetails.isCalculating ? (
            <RotateCw className="h-5 w-5 mr-2 animate-spin" />
          ) : (
            <RotateCw className="h-5 w-5 mr-2" />
          )}
          Optimizar ruta
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
            <div id="map" className="h-[400px] rounded-lg mb-4 relative z-0" />

            {routeDetails.error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2" />
                <p className="text-sm text-red-700">{routeDetails.error}</p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Dirección
                </label>
                <input
                  id="address"
                  type="text"
                  value={newStop.address}
                  onChange={(e) =>
                    setNewStop({ ...newStop, address: e.target.value })
                  }
                  placeholder="Dirección"
                  className={`w-full px-3 py-2 border rounded-md text-gray-900 dark:text-white bg-white dark:bg-gray-700 ${
                    inputErrors.address
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                />
                {inputErrors.address && (
                  <p className="mt-1 text-xs text-red-500">
                    {inputErrors.address}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Ciudad
                </label>
                <input
                  id="city"
                  type="text"
                  value={newStop.city}
                  onChange={(e) =>
                    setNewStop({ ...newStop, city: e.target.value })
                  }
                  placeholder="Ciudad"
                  className={`w-full px-3 py-2 border rounded-md text-gray-900 dark:text-white bg-white dark:bg-gray-700 ${
                    inputErrors.city
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                />
                {inputErrors.city && (
                  <p className="mt-1 text-xs text-red-500">
                    {inputErrors.city}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="type"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Tipo
                </label>
                <select
                  id="type"
                  value={newStop.type}
                  onChange={(e) =>
                    setNewStop({
                      ...newStop,
                      type: e.target.value as Stop["type"],
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 text-gray-900 dark:text-white bg-white dark:bg-gray-700"
                >
                  <option value="store">🏪 Tienda</option>
                  <option value="restaurant">🍽️ Restaurante</option>
                  <option value="pharmacy">💊 Farmacia</option>
                  <option value="supermarket">🛒 Supermercado</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="time"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Hora
                </label>
                <input
                  id="time"
                  type="time"
                  value={newStop.time}
                  onChange={(e) =>
                    setNewStop({ ...newStop, time: e.target.value })
                  }
                  className={`w-full px-3 py-2 border rounded-md text-gray-900 dark:text-white bg-white dark:bg-gray-700 ${
                    inputErrors.time
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                />
                {inputErrors.time && (
                  <p className="mt-1 text-xs text-red-500">
                    {inputErrors.time}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4">
              <button
                onClick={addStop}
                disabled={routeDetails.isCalculating}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                <Plus className="h-5 w-5 mr-2" />
                Agregar parada
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Detalles de la ruta
            </h2>
            {userLocation && (
              <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-md">
                <p className="text-sm text-blue-700 dark:text-blue-200">
                  Ubicación actual: {userLocation.address}, {userLocation.city}
                </p>
              </div>
            )}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Distancia total
                </label>
                <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                  {routeDetails.totalDistance.toFixed(1)} km
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Tiempo estimado
                </label>
                <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                  {formatTime(routeDetails.totalTime)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Paradas
                </label>
                <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                  {stops.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Instrucciones de ruta
            </h2>
            {routeDetails.instructions &&
            routeDetails.instructions.length > 0 ? (
              <ol className="list-decimal list-inside space-y-2">
                {routeDetails.instructions.map((instruction, index) => (
                  <li
                    key={index}
                    className="text-sm text-gray-700 dark:text-gray-300"
                  >
                    {instruction}
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                Calcula la ruta para ver las instrucciones
              </p>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Paradas programadas
            </h2>
            <div className="space-y-3">
              {stops.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                  No hay paradas agregadas
                </p>
              ) : (
                stops.map((stop, index) => (
                  <div
                    key={stop.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center bg-blue-600 text-white rounded-full">
                        {index + 1}
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {stop.type === "store"
                            ? "🏪 Tienda"
                            : stop.type === "restaurant"
                            ? "🍽️ Restaurante"
                            : stop.type === "pharmacy"
                            ? "💊 Farmacia"
                            : "🛒 Supermercado"}
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {stop.address}, {stop.city}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {stop.time}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeStop(stop.id)}
                      className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                      title="Eliminar parada"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
