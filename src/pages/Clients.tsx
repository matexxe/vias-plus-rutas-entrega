// Este componente muestra una lista de clientes y permite agregar, modificar y eliminar clientes. 
import { useState } from "react";
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
import { clients } from "../data/Clientes";
import ClientForm from "../registros/ClientsForm";

// Extendemos la interfaz de cliente para incluir apellido
interface Client {
  id: number;
  name: string;
  apellido: string;
  address: string;
  contact: {
    email: string;
    phone: string;
  };
}

export function Clients() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [clientsData, setClientsData] = useState<Client[]>(clients as Client[]);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const filteredClients = clientsData.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.apellido &&
        client.apellido.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddClient = (clientData: {
    name: string;
    apellido: string;
    address: string;
    email: string;
    phone: string;
  }) => {
    const newClient: Client = {
      id: clientsData.length + 1,
      name: clientData.name,
      apellido: clientData.apellido,
      address: clientData.address,
      contact: {
        email: clientData.email,
        phone: clientData.phone,
      },
    };

    setClientsData([...clientsData, newClient]);
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setShowForm(true);
  };

  const handleDeleteClient = (clientId: number) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este cliente?")) {
      setClientsData(clientsData.filter((client) => client.id !== clientId));
    }
  };

  return (
    <div className="space-y-6">
      {/* Título y Botón */}
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
          <Plus className=" h-5 w-5 mr-2" />
          Agregar un nuevo cliente
        </button>
      </div>

      {/* Barra de Búsqueda */}
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

      {/* Tabla de Clientes */}
      {filteredClients.length > 0 ? (
        <div className="bg-white dark:bg-gray-800 shadow overflow-x-auto sm:overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-400 dark:divide-gray-700">
            <thead className="bg-gray-80 dark:bg-gray-700">
              <tr>
                <th
                  scope="col"
                  className="px-3 py-3 text-left pl-15 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider 
                  whitespace-nowrap"
                >
                  Nombre
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase
                   tracking-wider whitespace-nowrap"
                >
                  Apellido
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 
                  uppercase tracking-wider whitespace-nowrap"
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 
                  uppercase tracking-wider whitespace-nowrap"
                >
                  Dirección
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 
                  uppercase tracking-wider whitespace-nowrap"
                >
                  Teléfono
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 text-left text-xs font-medium text-gray-500
                   dark:text-gray-300 uppercase tracking-wider whitespace-nowrap"
                >
                  Eliminar/Editar
                </th>
              </tr>
            </thead>
            <tbody
              className="bg-white divide-y divide-gray-200 dark:bg-gray-800
             dark:divide-gray-700"
            >
              {filteredClients.map((client) => (
                <tr key={client.id}>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        <UserCircle className="h-8 w-8 text-gray-400" />
                      </div>
                      <div className="ml-2 sm:ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {client.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {client.apellido}
                    </div>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <div className="text-xs sm:text-sm text-gray-900 dark:text-white">
                      <Mail className="inline h-3 w-3 mr-1" />
                      {client.contact.email}
                    </div>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <div className="text-xs sm:text-sm text-gray-900 dark:text-white truncate">
                      <MapPin className="inline h-3 w-3 mr-1" />
                      {client.address}
                    </div>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <div className="text-xs sm:text-sm text-gray-900 dark:text-white">
                      <Phone className="inline h-3 w-3 mr-1" />
                      {client.contact.phone}
                    </div>
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
                      onClick={() => handleDeleteClient(client.id)}
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

      {/* Formulario Modal */}
      {showForm && (
        <ClientForm
          onClose={() => {
            setShowForm(false);
            setEditingClient(null);
          }}
          onSubmit={(clientData) => {
            if (editingClient) {
              // Update existing client
              const updatedClients = clientsData.map((client) =>
                client.id === editingClient.id
                  ? {
                      ...client,
                      name: clientData.name,
                      apellido: clientData.apellido,
                      address: clientData.address,
                      contact: {
                        email: clientData.email,
                        phone: clientData.phone,
                      },
                    }
                  : client
              );
              setClientsData(updatedClients);
            } else {
              // Add new client
              handleAddClient(clientData);
            }
            setEditingClient(null);
          }}
          initialData={
            editingClient
              ? {
                  name: editingClient.name,
                  apellido: editingClient.apellido,
                  address: editingClient.address,
                  email: editingClient.contact.email,
                  phone: editingClient.contact.phone,
                }
              : undefined
          }
        />
      )}
    </div>
  );
}
