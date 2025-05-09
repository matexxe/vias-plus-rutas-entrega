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
2.	El sistema permite iniciar sesion con nombre de usuario y clave.
3.	El sistema permite registrar, consultar, eliminar y actualizar clientes en tiempo real.
4.	El sistema permite registrar, consultar, eliminar y actualizar pedidos en tiempo real. 
5.	El sistema permite hacer seguimiento de pedidos en tránsito.
6.	El sistema cuenta con una función de rutas, que calcula la dirección del cliente desde la ubicación del negocio optimizando el trayecto.
7.	El sistema puede calcular la dirección del pedido a entregar, da unas instrucciones para la eficiencia de la entrega.
8.	El sistema permite registrar, consultar, eliminar y actualizar conductores en tiempo real. También se le permite al administrador asignarle pedidos. 
9.	El sistema permite generar reportes para analizar eficiencia y métricas de entregas. 
10.	El sistema permite una configuración donde pueden verse las notificaciones. Se permite eliminar reportes y seguir el historial de los últimos pedidos.


## Lista de requerimientos no funcionales:

1.	El sistema es intuitivo. Cuenta con un darkMode donde puede cambiarse el tema de claro a azul oscuro. 
2.	Cuenta con un panel lateral donde están las herramientas del sistema. 

*Esto es importante:* Todos los datos son simulados. Solo es prueba ya que no he encontrado como ponerlo en produccion en la vida real. 

# 🧾 Funcionalidad del sistema: Clientes, pedidos y conductores

Este proyecto permite registrar clientes, generar pedidos y asignarlos a conductores disponibles. A continuación, se va a demostrar cómo funciona todo paso a paso:

---

## ✅ 1. Registro de un cliente

Primero registramos un cliente desde la interfaz:

![Registro de cliente](https://github.com/user-attachments/assets/a23bfcc2-94db-4d4d-8c1d-30a765685962)

### Verificamos que haya llegado correctamente a la base de datos (MongoDB):

![Cliente en MongoDB](https://github.com/user-attachments/assets/51611ccc-f192-4fa8-b99b-6c86d7e58abb)

---

## 📦 2. Creación de un pedido con ese cliente

Creamos un pedido usando la información del cliente recién registrado:

![Creación de pedido](https://github.com/user-attachments/assets/fcb7b862-7110-4445-adcb-2a35ed829cb7)

### Se guarda en la base de datos. Como aún no tiene conductor, ese campo queda en `null` por defecto:

![Pedido sin conductor](https://github.com/user-attachments/assets/c915176f-7510-4557-a68c-f7e1c4431ffc)

---

## 🚗 3. Registro de un conductor

Registramos un conductor disponible para asignar el pedido:

![Registro de conductor](https://github.com/user-attachments/assets/d231018a-608c-48eb-92a8-f9a6c398fe04)

---

## 📝 4. Asignación de conductor al pedido

Asignamos el conductor al pedido registrado:

![Asignación de conductor](https://github.com/user-attachments/assets/9902b2c8-3050-4339-93ba-3e605f59d4c4)

### Verificamos en la base de datos que ahora el pedido tenga asignado el ID del conductor:

![Pedido con conductor asignado](https://github.com/user-attachments/assets/34feac59-0d7a-4759-bc8a-26465d2426d3)

---

## 🚦 5. Consultar pedidos de un conductor

Mediante el endpoint `GET /api/pedidos/conductor/:conductorId`, podemos obtener todos los pedidos asociados a un conductor específico:

![Pedidos de un conductor](https://github.com/user-attachments/assets/51ccbaba-076f-4eb3-b8b8-6a3652e528cb)

---

## 🔄 6. Cambio de estado de disposición del conductor

Podemos cambiar el estado de disposición de un conductor para asignarle nuevos pedidos o retirarlo de los disponibles:

![Cambio de estado del conductor](https://github.com/user-attachments/assets/d8688bc5-7333-4e08-b45d-fa34a05fa1a4)

### Verificamos el cambio en la base de datos:

![Estado actualizado en la base de datos](https://github.com/user-attachments/assets/3b093d15-b55a-4a13-8245-e2af211750ac)

---

## 🗑️ 7. Eliminación de un pedido

Si eliminamos un pedido, el conductor también pierde la asignación automáticamente:

![Eliminación de pedido](https://github.com/user-attachments/assets/e659e9d3-3606-40b6-8afd-1ed5a96e05cd)
![Pedido eliminado](https://github.com/user-attachments/assets/14e8aba6-1f89-4830-98ae-377dd7178af1)

### La base de datos ahora queda vacía:

![Base de datos vacía](https://github.com/user-attachments/assets/5ffe8416-8ff6-435a-ae6e-eba000860869)

---

## 🧹 8. Eliminación de un cliente y sus pedidos asociados

Cuando se elimina un cliente, el sistema también elimina automáticamente todos sus pedidos asociados. Esto se logra mediante una operación en el backend que primero busca y elimina todos los documentos de la colección de pedidos cuyo campo `cliente_id` coincida con el ID del cliente, y luego elimina al cliente de la base de datos. Así se garantiza la integridad de los datos y se evita dejar registros vacíos. 

![image](https://github.com/user-attachments/assets/e43698d9-aff5-4d0a-8f37-207f5fc7cd7c)
![image](https://github.com/user-attachments/assets/22ef8356-d33f-4c21-9c05-ce3d36ed37b9)
![image](https://github.com/user-attachments/assets/883e765a-8c9a-41bf-b9ce-1016f5c60daa)






Aquí está el fragmento de código responsable de esta operación:

```js
await Pedido.deleteMany({ cliente_id: id });
await Cliente.findByIdAndDelete(id);

```

### Servidor de express.js 

```bash
https://github.com/matexxe/express-vias-plus
```


## Funcionalidad del gráfico de rendimiento

El gráfico de barras muestra el desempeño de entregas por conductor, permitiendo visualizar cambios en los estados. Aquellos pedidos que esten proceso, quedan como atrasados en el grafico.
Pasa igual con los demas estados, solo cuenta como entregado cuando el pedido tiene ese estado.

Ejes del gráfico:

- El eje X representa los distintos estados de las entregas (entregado, en progreso, pendiente, cancelado).
- El eje Y indica la cantidad de entregas en cada estado.
![Captura de pantalla 2025-05-09 144751](https://github.com/user-attachments/assets/1cb12e81-d7f4-4515-8b48-7057969b5660)

## Generacion de PDF

Se genera el pdf con todos los datos

![image](https://github.com/user-attachments/assets/b9197882-ad3f-4186-ab5a-debd004c24b5)




## Tecnologias usadas:

* TypeScript
* React
* Tailwind
* MongoDB
* Express.js
