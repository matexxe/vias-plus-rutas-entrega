import { useState, useEffect } from "react";
import {
  UserCircle,
  Mail,
  MapPin,
  Search,
  Edit,
  Trash2,
  Plus,
  AlertCircle,
  Phone,
} from "lucide-react";
import { ClientForm } from "../registros/ClientsForm";

interface Client {
  _id?: string;
  nombre: string;
  apellido: string;
  direccion: string;
  email: string;
  telefono: string;
}

export function Clients() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [clientsData, setClientsData] = useState<Client[]>([]);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/clientes");
        const data = await response.json();
        setClientsData(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error al cargar clientes:", error);
        setIsLoading(false);
      }
    };
    fetchClients();
  }, []);

  const filteredClients = clientsData.filter((client) => {
    return (
      (client.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.apellido?.toLowerCase().includes(searchTerm.toLowerCase())) ??
      false
    );
  });

  const handleAddClient = async (clientData: Omit<Client, "_id">) => {
    try {
      const response = await fetch("http://localhost:5000/api/clientes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(clientData),
      });

      if (response.ok) {
        const newClient = await response.json();
        setClientsData([...clientsData, newClient]);
      } else {
        console.error(
          "Error en la creación del cliente:",
          await response.json()
        );
      }
    } catch (error) {
      console.error("Error al agregar cliente:", error);
    }
  };

  const handleUpdateClient = async (clientData: Omit<Client, "_id">) => {
    if (!editingClient?._id) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/clientes/${editingClient._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(clientData),
        }
      );

      if (response.ok) {
        const updatedClient = await response.json();
        setClientsData(
          clientsData.map((client) =>
            client._id === editingClient._id ? updatedClient : client
          )
        );
      } else {
        console.error("Error al actualizar cliente:", await response.json());
      }
    } catch (error) {
      console.error("Error al actualizar cliente:", error);
    }
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setShowForm(true);
  };

  const handleDeleteClient = async (clientId?: string) => {
    if (
      !clientId ||
      !window.confirm("¿Estás seguro de que deseas eliminar este cliente?")
    ) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/clientes/${clientId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setClientsData(clientsData.filter((client) => client._id !== clientId));
      } else {
        console.error("Error al eliminar cliente:", await response.json());
      }
    } catch (error) {
      console.error("Error al eliminar cliente:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-0">
          Clientes
        </h1>
        <button
          className="inline-flex items-center px-4 py-2 border border-gray-400 shadow-sm text-sm font-medium rounded-md text-black dark:text-white 
          bg-primary hover:bg-primary-600 
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          onClick={() => setShowForm(true)}
        >
          <Plus className="h-5 w-5 mr-2" />
          Nuevo cliente
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar clientes..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {filteredClients.length > 0 ? (
        <div className="bg-white dark:bg-gray-800 shadow overflow-x-auto sm:overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-400 dark:divide-gray-700">
            <thead className="bg-gray-80 dark:bg-gray-700">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">
                  Nombre
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">
                  Apellido
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">
                  Email
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">
                  Dirección
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">
                  Teléfono
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
              {filteredClients.map((client) => (
                <tr key={client._id}>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <UserCircle className="h-8 w-8 text-gray-400" />
                      <div className="ml-2 sm:ml-4 text-sm font-medium text-gray-900 dark:text-white">
                        {client.nombre}
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {client.apellido}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 dark:text-white">
                    <Mail className="inline h-3 w-3 mr-1" />
                    {client.email}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 dark:text-white truncate">
                    <MapPin className="inline h-3 w-3 mr-1" />
                    {client.direccion}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 dark:text-white">
                    <Phone className="inline h-3 w-3 mr-1" />
                    {client.telefono}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-xs sm:text-sm font-medium">
                    <button
                      className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200 mr-2"
                      onClick={() => handleEditClient(client)}
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200"
                      onClick={() => handleDeleteClient(client._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              No se encontraron clientes
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {searchTerm
                ? "No hay clientes que coincidan con tu búsqueda."
                : "No hay clientes registrados en el sistema."}
            </p>
          </div>
        </div>
      )}

      {showForm && (
        <ClientForm
          onClose={() => {
            setShowForm(false);
            setEditingClient(null);
          }}
          onSubmit={(clientData) => {
            if (editingClient) {
              handleUpdateClient(clientData);
            } else {
              handleAddClient(clientData);
            }
            setShowForm(false);
            setEditingClient(null);
          }}
          initialData={editingClient || undefined}
        />
      )}
    </div>
  );
}
