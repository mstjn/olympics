import type { Participation, Olympic } from "../types";
import type { ActiveElement, ChartEvent, Plugin } from "chart.js";

const outlabelsPlugin: Plugin<"pie"> = {
  id: "outlabels",
  afterDraw(chart) {
    const ctx = chart.ctx;
    const meta = chart.getDatasetMeta(0);
    const labels = chart.data.labels as string[];

    const colors = chart.data.datasets[0].borderColor as string[];

    meta.data.forEach((arc, i) => {
      const { startAngle, endAngle, outerRadius, x, y } = arc.getProps(
        ["startAngle", "endAngle", "outerRadius", "x", "y"],
        true
      );

      const midAngle = (startAngle + endAngle) / 2;
      const cosA = Math.cos(midAngle);
      const sinA = Math.sin(midAngle);

      const x1 = x + cosA * outerRadius;
      const y1 = y + sinA * outerRadius;
      const x2 = x1 + (cosA >= 0 ? 80 : -80);

      ctx.save();
      ctx.strokeStyle = colors[i];
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y1);
      ctx.stroke();

      ctx.fillStyle = "black";
      ctx.font = "bold 14px Inter, sans-serif";
      ctx.textAlign = cosA >= 0 ? "left" : "right";
      ctx.textBaseline = "middle";
      const textX = x2 + (cosA >= 0 ? 4 : -4);
      const padding = 4;
      const textWidth = ctx.measureText(labels[i]).width;
      ctx.fillStyle = "white";
      ctx.fillRect(
        cosA >= 0 ? textX - padding : textX - textWidth - padding,
        y1 - 9,
        textWidth + padding * 2,
        18
      );
      ctx.fillStyle = "black";
      ctx.fillText(labels[i], textX, y1);
      ctx.restore();
    });
  },
};

export function chartEvolutionData(country: Olympic) {
  const sorted = [...country.participations].sort((a, b) => a.year - b.year);

  const evolutionData = {
    labels: sorted.map((p: Participation) => p.year.toString()),
    datasets: [
      {
        label: "Nombre de médailles",
        data: sorted.map((p: Participation) => p.medalsCount),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0,
      },
    ],
  };

  const evolutionOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        ticks: {
          color: "#374151",
        },
        grid: {
          color: "rgba(0, 0, 0, 0.08)",
        },
        border: {
          display: false,
        },
      },
      x: {
        ticks: {
          color: "#374151",
        },
        grid: {
          color: "rgba(0, 0, 0, 0.08)",
        },
        title: {
          display: true,
          text: "Dates",
          color: "#374151",
          font: { size: 14 },
        },
      },
    },
  };

  return { evolutionData, evolutionOptions };
}

export function buildOlympicsChartData(data: Olympic[], navigate: (path: string) => void) {
  const calculateTotalMedals = (country: Olympic) => {
    return country.participations.reduce((sum: number, p: Participation) => sum + p.medalsCount, 0);
  };

  const totalParticipatingCountries = data ? data.length : 0;
  const totalGamesEditions = 5;

  const chartData = {
    labels: data.map((d: Olympic) => d.name),
    datasets: [
      {
        label: "Total des médailles",
        data: data.map((d: Olympic) => calculateTotalMedals(d)),
        backgroundColor: [
          "rgba(180, 30, 60, 0.85)",
          "rgba(30, 100, 190, 0.85)",
          "rgba(200, 140, 0, 0.85)",
          "rgba(20, 140, 140, 0.85)",
          "rgba(110, 50, 200, 0.85)",
        ],
        borderColor: [
          "rgb(140, 20, 45)",
          "rgb(20, 75, 150)",
          "rgb(160, 110, 0)",
          "rgb(15, 105, 105)",
          "rgb(80, 30, 160)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    onClick: (_event: ChartEvent, elements: ActiveElement[]) => {
      if (elements.length === 0) return;
      navigate(`/${data[elements[0].index].id}`);
    },
    maintainAspectRatio: false,
    layout: {
      padding: 80,
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return { chartData, chartOptions, totalGamesEditions, totalParticipatingCountries, outlabelsPlugin };
}
