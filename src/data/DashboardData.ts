export const deliveryData = {
  labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
  datasets: [
    {
      label: 'Entregas',
      data: [12, 19, 15, 17, 14, 13, 15],
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.4,
    },
  ],
};

export const statusData = {
  labels: ['Pendiente', 'En proceso', 'Entregado'],
  datasets: [
    {
      data: [15, 25, 60],
      backgroundColor: [
        'rgb(255, 159, 64)',
        'rgb(54, 162, 235)',
        'rgb(75, 192, 192)',
      ],
    },
  ],
};
