# Vias Plus - Trabajo del SENA

## Características

- Gestión de rutas
- Modo oscuro (`dark mode`)
- Cálculo de rutas por medio de la API de OpenStreetMap.

### Para clonar el repositorio

```bash
git clone https://github.com/matexxe/vias-plus-rutas-entrega
```
### Para instalar los modulos:
 ```bash
npm install
```

### Para lanzar la aplicacion:
 ```bash
npm run dev
```

## Lista de requerimientos funcionales:
1.	El sistema cuenta con un dashboard donde se resume el estado del sistema con datos relevantes. 
2.	El sistema permite registrar, consultar, eliminar y actualizar clientes en tiempo real.
3.	El sistema permite registrar, consultar, eliminar y actualizar pedidos en tiempo real. 
4.	El sistema permite hacer seguimiento de pedidos en tránsito.
5.	El sistema cuenta con una función de rutas, que calcula la dirección del cliente desde la ubicación del negocio optimizando el trayecto.
6.	El sistema puede calcular la dirección del pedido a entregar, da unas instrucciones para la eficiencia de la entrega.
7.	El sistema permite registrar, consultar, eliminar y actualizar conductores en tiempo real. También se le permite al administrador asignarle pedidos. 
8.	El sistema permite generar reportes para analizar eficiencia y métricas de entregas. 
9.	El sistema permite una configuración donde pueden verse las notificaciones. Se permite eliminar reportes y seguir el historial de los últimos pedidos.


## Lista de requerimientos no funcionales:

1.	El sistema es intuitivo. Cuenta con un darkMode donde puede cambiarse el tema de claro a azul oscuro. 
2.	Cuenta con un panel lateral donde están las herramientas del sistema. 

*Esto es importante:* Todos los datos son simulados. Solo es prueba ya que no he encontrado como ponerlo en produccion en la vida real. 

# Funcionalidad en las entidades cliente, pedido y conductor:
## Registraremos un cliente para la demostracion: 
![Image](https://github.com/user-attachments/assets/a23bfcc2-94db-4d4d-8c1d-30a765685962)

## Se verifica que el registro haya llegado a la base de datos, en este caso MongoDB:
![Image](https://github.com/user-attachments/assets/51611ccc-f192-4fa8-b99b-6c86d7e58abb)

## Crearemos un pedido con la informacion registrada del cliente:
![Image](https://github.com/user-attachments/assets/fcb7b862-7110-4445-adcb-2a35ed829cb7)
## Se verifica en la base de datos (Como aun no hay asignacion de conductor, el valor llega como null por defecto)
![Image](https://github.com/user-attachments/assets/c915176f-7510-4557-a68c-f7e1c4431ffc)

## Se registra un conductor:
![Captura de pantalla 2025-05-04 171954](https://github.com/user-attachments/assets/d231018a-608c-48eb-92a8-f9a6c398fe04)

## El siguiente punto es asignar un conductor al pedido registrado:
![Image](https://github.com/user-attachments/assets/9902b2c8-3050-4339-93ba-3e605f59d4c4)

## En la base de datos se puede ver el pedido con el ID del conductor asignado:
![image](https://github.com/user-attachments/assets/34feac59-0d7a-4759-bc8a-26465d2426d3)


## Mediante el endpoint `GET /api/pedidos/conductor/:conductorId` obtenemos los pedidos que se asocian a un conductor específico:
![Captura de pantalla 2025-05-04 172558](https://github.com/user-attachments/assets/51ccbaba-076f-4eb3-b8b8-6a3652e528cb)

## Podemos cambiar el estado de disposicion de los conductores:
![Captura de pantalla 2025-05-04 172736](https://github.com/user-attachments/assets/d8688bc5-7333-4e08-b45d-fa34a05fa1a4)

## Se puede verificar en la base de datos:
![Captura de pantalla 2025-05-04 172811](https://github.com/user-attachments/assets/3b093d15-b55a-4a13-8245-e2af211750ac)

## Si quisieramos eliminar el pedido, se designa automaticamente del conductor al que se le asigno:
![image](https://github.com/user-attachments/assets/e659e9d3-3606-40b6-8afd-1ed5a96e05cd)
![image](https://github.com/user-attachments/assets/14e8aba6-1f89-4830-98ae-377dd7178af1)

## Y la base de datos queda vacia:
![image](https://github.com/user-attachments/assets/5ffe8416-8ff6-435a-ae6e-eba000860869)






## Tecnologias usadas:

* TypeScript
* React
* Tailwind
* MongoDB
* Express.js
