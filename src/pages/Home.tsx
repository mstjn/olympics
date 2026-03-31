import { useState, useEffect, type FC } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement } from "chart.js";
import { Pie } from "react-chartjs-2";
import { getOlympics } from "../api/api";
import type { Country, Participation } from "../types";
import Indicator from "../components/Indicator";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement);

const olympicsData = getOlympics();

const Home: FC = () => {
  const [data, setData] = useState<Country[] | null>(null);

  // Anti-pattern 4 — useEffect avec logique lourde dans le composant — idéalement : custom hook ou librairie de fetching de données (ex. react-query).
  // De plus en mode développement, le "strict mode" de React est activé, ce qui va éxecuter ce code 2
  useEffect(() => {
    setTimeout(() => {
      setData(olympicsData);
    }, 500);
  }, []);

  // Anti-pattern 6 — Logique métier complexe directement dans le composant
  const calculateTotalMedals = (country: Country) => {
    return country.participations.reduce((sum: number, p: Participation) => sum + p.medalsCount, 0);
  };

  const totalParticipatingCountries = data ? data.length : 0;
  const totalGamesEditions = 5;

  // Anti-pattern 7 — État de chargement dérivé des données au lieu d'un état dédié (loading/error).
  if (!data) {
    return <div>Chargement...</div>;
  }

  const chartData = {
    labels: data.map((d: Country) => d.name),
    datasets: [
      {
        label: "Total des médailles",
        data: data.map((d: Country) => calculateTotalMedals(d)),
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ],
        borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)", "rgba(255, 206, 86, 1)", "rgba(75, 192, 192, 1)", "rgba(153, 102, 255, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          color: "white",
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Historique des Jeux Olympiques - TéléSport</h1>

        <div className="mb-8">
          <p className="text-lg">
            Bienvenue sur la page dédiée à l'historique des Jeux Olympiques. Explorez les performances des pays au fil des années.
          </p>
        </div>

        <div className="mb-2">
          <Indicator total={totalParticipatingCountries} text={"Pays participants"} />
          <Indicator total={totalGamesEditions} text={"Éditions des JO"} color={true} />
        </div>

        <div className="bg-gray-800 p-8 rounded-lg shadow-xl">
          <div style={{ height: "400px" }}>
            <Pie data={chartData} options={chartOptions} />
          </div>
        </div>

        <div className="text-sm text-gray-400">
          <p>Cliquez sur un pays pour voir ses détails</p>
        </div>
      </div>
    </div>
  );
};

export default Home

