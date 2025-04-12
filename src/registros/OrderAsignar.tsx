
//Aqui se define el formulario para asignar pedidos a los conductores. 
import { useState } from "react";
import { Button } from "../UI/Button";
import { Input } from "../UI/Input";
import { Label } from "../UI/Label";
import { Textarea } from "../UI/Textarea";
import { Driver } from "../interfaces/Drivers";
import { OrderDriver } from "../interfaces/OrderDriver";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../UI/Select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../UI/Dialog";

// Tipado para las props que recibe el formulario de asignación de órdenes
interface OrderAssignmentFormProps {
  onClose: () => void; // Función para cerrar el formulario
  onSubmit: (orderData: OrderDriver) => void; // Función que se ejecuta al enviar el formulario
  driver: Driver; // Conductor al que se asignará la orden
  orderToEdit?: OrderDriver; // Orden a editar (si se está editando)
  availableOrders?: OrderDriver[]; // Lista de órdenes disponibles para asignar
}

// Componente de formulario para asignar o editar una orden de un conductor
export function OrderAsignarForm({
  onClose,
  onSubmit,
  driver,
  orderToEdit,
  availableOrders = [],
}: OrderAssignmentFormProps) {
  // Estado que indica si se está creando una nueva orden (true) o editando una existente (false)
  const [isNewOrder, setIsNewOrder] = useState(!orderToEdit);

  // ID de la orden seleccionada si se elige una de la lista de disponibles
  const [selectedOrderId, setSelectedOrderId] = useState<string>(
    orderToEdit?.id?.toString() || ""
  );

  // Estado con los datos del formulario (orden actual)
  const [orderData, setOrderData] = useState<OrderDriver>(
    orderToEdit || {
      orderNumber: "",
      customerName: "",
      address: "",
      details: "",
      status: "Pendiente",
    }
  );

  // Maneja la selección de una orden desde la lista de órdenes disponibles
  const handleOrderSelect = (orderId: string) => {
    if (orderId) {
      const selectedOrder = availableOrders.find(
        (order) => order.id?.toString() === orderId
      );
      if (selectedOrder) {
        setOrderData(selectedOrder); // Carga los datos de la orden seleccionada
      }
      setSelectedOrderId(orderId); // Guarda el ID seleccionado
    }
  };

  // Maneja los cambios en los campos del formulario
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setOrderData((prev) => ({ ...prev, [name]: value })); // Actualiza el estado con el nuevo valor
  };

  // Maneja el envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario
    onSubmit(orderData); // Ejecuta la función pasada por props con los datos de la orden
  };


  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-white dark:bg-gray-800 shadow rounded-lg p-0 border border-gray-200 dark:border-gray-700 transition-all duration-200 hover:shadow-lg hover:shadow-primary/10 dark:hover:shadow-primary/5">
        <DialogHeader className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">
            {orderToEdit ? "Actualizar pedido" : "Asignar pedido"}
            {driver && (
              <span className="ml-1 text-primary">para {driver.name}</span>
            )}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {!orderToEdit && availableOrders.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="existingOrder"
                  checked={!isNewOrder}
                  onChange={() => setIsNewOrder(false)}
                  className="h-4 w-4 text-primary"
                />
                <Label
                  htmlFor="existingOrder"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Seleccionar pedido existente
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="newOrder"
                  checked={isNewOrder}
                  onChange={() => setIsNewOrder(true)}
                  className="h-4 w-4 text-primary"
                />
                <Label
                  htmlFor="newOrder"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Crear nuevo pedido
                </Label>
              </div>
            </div>
          )}

          {!isNewOrder && availableOrders.length > 0 ? (
            <div className="space-y-2">
              <Label
                htmlFor="orderId"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Pedido
              </Label>
              <Select value={selectedOrderId} onValueChange={handleOrderSelect}>
                <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white transition-all duration-200 hover:shadow-md hover:shadow-primary/10 dark:hover:shadow-primary/5">
                  <SelectValue placeholder="Seleccionar pedido" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200 hover:shadow-lg hover:shadow-primary/10 dark:hover:shadow-primary/5">
                  {availableOrders.map((order) => (
                    <SelectItem
                      key={order.id}
                      value={order.id?.toString() || ""}
                      className="hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200"
                    >
                      {order.orderNumber} - {order.customerName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label
                  htmlFor="orderNumber"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Número de pedido
                </Label>
                <Input
                  id="orderNumber"
                  name="orderNumber"
                  value={orderData.orderNumber}
                  onChange={handleChange}
                  required
                  className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="customerName"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Nombre del cliente
                </Label>
                <Input
                  id="customerName"
                  name="customerName"
                  value={orderData.customerName}
                  onChange={handleChange}
                  required
                  className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="address"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Dirección de entrega
                </Label>
                <Input
                  id="address"
                  name="address"
                  value={orderData.address}
                  onChange={handleChange}
                  required
                  className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                />
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label
              htmlFor="details"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Detalles del pedido
            </Label>
            <Textarea
              id="details"
              name="details"
              value={orderData.details}
              onChange={handleChange}
              rows={3}
              className="w-full min-h-[80px] resize-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:ring-primary focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="status"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Estado
            </Label>
            <Select
              value={orderData.status}
              onValueChange={(value) =>
                setOrderData((prev) => ({
                  ...prev,
                  status: value as OrderDriver["status"],
                }))
              }
            >
              <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <SelectItem
                  value="Pendiente"
                  className="hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  Pendiente
                </SelectItem>
                <SelectItem
                  value="En proceso"
                  className="hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  En proceso
                </SelectItem>
                <SelectItem
                  value="Entregado"
                  className="hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  Entregado
                </SelectItem>
                <SelectItem
                  value="Cancelado"
                  className="hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  Cancelado
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              type="button"
              onClick={onClose}
              className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-primary hover:bg-primary-600 text-black dark:text-white shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {orderToEdit ? "Actualizar" : "Asignar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
