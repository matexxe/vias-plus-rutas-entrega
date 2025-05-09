import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import {
  PerformanceData,
  ReportFilters,
  AvailableReport,
  Conductor,
  Pedido,
} from "../interfaces/Report";

const API_URL = "http://localhost:5000/api";

// Función para obtener datos de rendimiento
export const fetchDeliveryPerformance = async (
  filters: ReportFilters = {}
): Promise<PerformanceData> => {
  try {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        queryParams.append(key, value.toString());
      }
    });

    const response = await fetch(
      `${API_URL}/pedidos?${queryParams.toString()}`
    );
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const pedidos: Pedido[] = await response.json();
    return processPedidosForChart(pedidos);
  } catch (error) {
    console.error("Error en fetchDeliveryPerformance:", error);
    throw error;
  }
};

// Función para obtener reportes disponibles
export const fetchAvailableReports = async (): Promise<AvailableReport[]> => {
  return [
    {
      _id: "performance",
      name: "Reporte de rendimiento",
      description: "Estadísticas de entregas a tiempo vs retrasadas",
      createdAt: new Date(),
      type: "performance",
    },
    {
      _id: "drivers",
      name: "Reporte de conductores",
      description: "Eficiencia y desempeño de conductores",
      createdAt: new Date(),
      type: "drivers",
    },
  ];
};

// Procesar datos para gráficos
function processPedidosForChart(pedidos: Pedido[]): PerformanceData {
  const days = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
  const onTimeData = [0, 0, 0, 0, 0, 0, 0];
  const lateData = [0, 0, 0, 0, 0, 0, 0];

  pedidos.forEach((pedido) => {
    if (!pedido.fechaEntrega) return;
    const fecha = new Date(pedido.fechaEntrega);
    const day = fecha.getDay();
    const adjustedDay = day === 0 ? 6 : day - 1;

    if (pedido.estatus === "entregado") {
      onTimeData[adjustedDay]++;
    } else {
      lateData[adjustedDay]++;
    }
  });

  return {
    labels: days,
    datasets: [
      {
        label: "Entregas a tiempo",
        data: onTimeData,
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
      {
        label: "Entregas retrasadas",
        data: lateData,
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };
}

// Función para descargar reporte de rendimiento
export const downloadPerformanceReport = async (
  performanceData: PerformanceData
): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new jsPDF();
      let yPos = 20;

      // Configuración inicial
      doc.setFont("helvetica", "normal");

      // Título del reporte
      doc.setFontSize(20);
      doc.setTextColor(40);
      doc.text("Reporte de rendimiento de entregas (Prueba)", 105, yPos, {
        align: "center",
      });
      yPos += 15;

      // Fecha de generación
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generado el: ${new Date().toLocaleDateString()}`, 160, yPos);
      yPos += 20;

      // Resumen estadístico
      doc.setFontSize(14);
      doc.setTextColor(40);
      doc.text("Resumen estadístico:", 14, yPos);
      yPos += 10;

      const totalOnTime = performanceData.datasets[0].data.reduce(
        (a, b) => a + b,
        0
      );
      const totalLate = performanceData.datasets[1].data.reduce(
        (a, b) => a + b,
        0
      );
      const totalDeliveries = totalOnTime + totalLate;
      const onTimePercentage =
        totalDeliveries > 0
          ? Math.round((totalOnTime / totalDeliveries) * 100)
          : 0;

      doc.setFontSize(12);
      doc.setTextColor(80);
      doc.text(`• Entregas totales: ${totalDeliveries}`, 20, yPos);
      yPos += 10;
      doc.text(
        `• Entregas a tiempo: ${totalOnTime} (${onTimePercentage}%)`,
        20,
        yPos
      );
      yPos += 10;
      doc.text(`• Entregas retrasadas: ${totalLate}`, 20, yPos);
      yPos += 20;

      // Tabla de datos resumidos
      autoTable(doc, {
        head: [["Día", "Entregas a tiempo", "Entregas retrasadas"]],
        body: performanceData.labels.map((day, i) => [
          day,
          performanceData.datasets[0].data[i].toString(),
          performanceData.datasets[1].data[i].toString(),
        ]),
        startY: yPos,
        theme: "grid",
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: "bold",
        },
        columnStyles: {
          0: { cellWidth: 30 },
          1: { cellWidth: 40 },
          2: { cellWidth: 40 },
        },
        didDrawCell: (data) => {
          if (data.column.index === 2 && parseInt(data.cell.raw?.toString() || "0") > 5) {
            doc.setTextColor(255, 0, 0);
          }
        },
      });

      // Sección de Distribución por día - Gráfico visual
      yPos = (doc as any).lastAutoTable.finalY + 15;
      doc.setFontSize(14);
      doc.setTextColor(40);
      doc.text("Distribución por día:", 14, yPos);
      yPos += 10;

      // Crear gráfico de barras visual
      const maxValue = Math.max(
        ...performanceData.datasets[0].data.concat(
          performanceData.datasets[1].data
        )
      );
      const scaleFactor = 50 / (maxValue || 1); // Escala para que el máximo sea 50mm

      performanceData.labels.forEach((day, i) => {
        const onTime = performanceData.datasets[0].data[i];
        const late = performanceData.datasets[1].data[i];
        const xPos = 20;

        // Etiqueta del día
        doc.setFontSize(10);
        doc.setTextColor(40);
        doc.text(day, xPos, yPos + 5);

        // Barras
        doc.setFillColor(75, 192, 192); // Verde para entregas a tiempo
        doc.rect(xPos + 15, yPos, onTime * scaleFactor, 5, "F");

        doc.setFillColor(255, 99, 132); // Rojo para entregas retrasadas
        doc.rect(
          xPos + 15 + onTime * scaleFactor + 2,
          yPos,
          late * scaleFactor,
          5,
          "F"
        );

        // Valores
        doc.setFontSize(8);
        doc.text(
          `${onTime}`,
          xPos + 15 + (onTime * scaleFactor) / 2,
          yPos + 4,
          { align: "center" }
        );
        doc.text(
          `${late}`,
          xPos + 15 + onTime * scaleFactor + 2 + (late * scaleFactor) / 2,
          yPos + 4,
          { align: "center" }
        );

        yPos += 10;
      });

      // Leyenda
      yPos += 5;
      doc.setFontSize(10);
      doc.setTextColor(40);
      doc.text("Leyenda:", 14, yPos);
      yPos += 7;

      doc.setFillColor(75, 192, 192);
      doc.rect(20, yPos, 5, 5, "F");
      doc.text("Entregas a tiempo", 28, yPos + 4);

      doc.setFillColor(255, 99, 132);
      doc.rect(70, yPos, 5, 5, "F");
      doc.text("Entregas retrasadas", 78, yPos + 4);
      yPos += 15;

      // Pie de página
      doc.setFontSize(10);
      doc.setTextColor(150);
      doc.text(
        "ViasPlus - Sistema de gestion de pedidos - © " + new Date().getFullYear(),
        105,
        285,
        {
          align: "center",
        }
      );

      doc.save("reporte-rendimiento.pdf");
      resolve();
    } catch (error) {
      console.error("Error al generar PDF:", error);
      reject(error);
    }
  });
};

// Función para descargar reporte de conductores
export const downloadDriversReport = async (
  conductores: Conductor[]
): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new jsPDF();

      // Configuración inicial
      doc.setFont("helvetica", "normal");
      let yPos = 20;

      // Título
      doc.setFontSize(20);
      doc.setTextColor(40);
      doc.text("Reporte de conductores", 105, yPos, { align: "center" });
      yPos += 10;

      // Fecha
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generado el: ${new Date().toLocaleDateString()}`, 160, yPos);
      yPos += 15;

      // Tabla de conductores
      autoTable(doc, {
        head: [["Nombre", "Vehículo", "Entregas", "Estatus", "Calificación"]],
        body: conductores.map((conductor) => [
          conductor.nombre,
          conductor.vehiculo,
          conductor.entregasTotales.toString(),
          conductor.estatus,
          conductor.calificacionPromedio.toFixed(1),
        ]),
        startY: yPos,
        styles: {
          cellPadding: 5,
          fontSize: 10,
        },
        columnStyles: {
          0: { cellWidth: 40 },
          1: { cellWidth: 35 },
          2: { cellWidth: 25 },
          3: { cellWidth: 30 },
          4: { cellWidth: 25 },
        },
        headStyles: {
          fillColor: [52, 152, 219],
          textColor: 255,
          fontStyle: "bold",
        },
      });

      // Estadísticas resumen
      yPos = (doc as any).lastAutoTable.finalY + 15;
      doc.setFontSize(14);
      doc.setTextColor(40);
      doc.text("Resumen Estadístico:", 14, yPos);
      yPos += 10;

      const totalConductores = conductores.length;
      const totalEntregas = conductores.reduce(
        (sum, c) => sum + c.entregasTotales,
        0
      );
      const avgCalificacion =
        conductores.reduce((sum, c) => sum + c.calificacionPromedio, 0) /
        totalConductores;

      doc.setFontSize(12);
      doc.text(`• Total conductores: ${totalConductores}`, 20, yPos);
      yPos += 10;
      doc.text(`• Total entregas: ${totalEntregas}`, 20, yPos);
      yPos += 10;
      doc.text(
        `• Calificación promedio: ${avgCalificacion.toFixed(1)}`,
        20,
        yPos
      );
      yPos += 15;

      // Mejores conductores
      const topDrivers = [...conductores]
        .sort((a, b) => b.calificacionPromedio - a.calificacionPromedio)
        .slice(0, 3);

      doc.setFontSize(14);
      doc.text("Top 3 Conductores:", 14, yPos);
      yPos += 10;

      topDrivers.forEach((driver, index) => {
        doc.setFontSize(12);
        doc.text(
          `${index + 1}. ${
            driver.nombre
          } (${driver.calificacionPromedio.toFixed(1)})`,
          20,
          yPos
        );
        yPos += 10;
      });

      // Pie de página
      doc.setFontSize(10);
      doc.setTextColor(150);
      doc.text(
        "Sistema de Gestión de Pedidos - © " + new Date().getFullYear(),
        105,
        285,
        {
          align: "center",
        }
      );

      doc.save("reporte-conductores.pdf");
      resolve();
    } catch (error) {
      console.error("Error al generar PDF:", error);
      reject(error);
    }
  });
};
