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
