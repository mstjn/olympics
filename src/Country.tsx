import type { FC } from "react";
import { useParams } from "react-router-dom";
import type { Country, Participation } from "./types";
import Indicator from "./components/Indicator";
import { Line } from "react-chartjs-2";

interface CountryProps {
  olympicsData: Country[];
}

const Country: FC<CountryProps> = ({ olympicsData }) => {
  const { id } = useParams();

  const country: Country = olympicsData.find((c: Country) => c.id === Number(id));

  const totalMedals = country.participations.reduce((sum: number, p: Participation) => sum + p.medalsCount, 0);
  const totalAthletes = country.participations.reduce((sum: number, p: Participation) => sum + p.athleteCount, 0);
  const totalParticipations = country.participations.length;

  // Anti-pattern 10 — Préparation des données du graphique dans le composant — extraire dans une fonction ou un hook pour séparer UI et logique. https://react.dev/learn/thinking-in-react
  const evolutionData = {
    labels: country.participations.map((p: Participation) => p.year.toString()),
    datasets: [
      {
        label: "Nombre de médailles",
        data: country.participations.map((p: Participation) => p.medalsCount),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.3,
      },
    ],
  };

  const evolutionOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "white",
        },
      },
    },
    scales: {
      y: {
        ticks: {
          color: "white",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
      x: {
        ticks: {
          color: "white",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">{country.name}</h1>

        <div className="mb-2">
          <Indicator total={totalParticipations} text={"Participation"} />
          <Indicator total={totalMedals} text={"Total médailles"} />
          <Indicator total={totalAthletes} text={"Total athlètes"} />
        </div>

        <div className="bg-gray-800 p-8 rounded-lg shadow-xl">
          <div style={{ height: "400px" }}>
            <Line data={evolutionData} options={evolutionOptions} />
          </div>
        </div>

        <div className="text-sm text-gray-400">
          <p>Données des 5 dernières éditions des Jeux Olympiques</p>
        </div>
      </div>
    </div>
  );
};

export default Country;
