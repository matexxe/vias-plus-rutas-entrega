// Esta seccion contiene datos de rendimiento de entegas simulados. 
export const performanceData = {
  labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
  datasets: [
    {
      label: 'Entregas a tiempo',
      data: [65, 72, 68, 75, 70, 65, 60],
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
    },
    {
      label: 'Entregas retrasadas',
      data: [10, 8, 12, 5, 8, 10, 15],
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
  ],
};