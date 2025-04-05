
// Esta seccion contiene los datos para el dashboard de estadisticas.

import { Package, Truck, Clock, TrendingUp } from 'lucide-react';


export const stats = [
  {
    name: 'Total pedidos',
    value: '156',
    icon: Package,
    change: '+12%',
    changeType: 'positive',
  },
  {
    name: 'Conductores activos',
    value: '8',
    icon: Truck,
    change: '+2',
    changeType: 'positive',
  },
  {
    name: 'Tiempo promedio',
    value: '28m',
    icon: Clock,
    change: '-5m',
    changeType: 'positive',
  },
  {
    name: 'Tasa de eficiencia',
    value: '94%',
    icon: TrendingUp,
    change: '+2%',
    changeType: 'positive',
  },
];