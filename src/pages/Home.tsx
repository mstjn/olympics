import { type FC } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement } from "chart.js";
import { Pie } from "react-chartjs-2";
import Indicator from "../components/Indicator";
import { useData } from "../hooks/useData";
import { buildOlympicsChartData } from "../lib/chartsData";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement);

const Home: FC = () => {
  const { data, isLoading, error } = useData();
  if (isLoading) return <div>Chargement...</div>;
  if (error) return <div>Erreur : {error.message}</div>;
  if (!data) return <div>Aucune donnée</div>;
  const { totalParticipatingCountries, totalGamesEditions, chartData, chartOptions } = buildOlympicsChartData(data);

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

export default Home;
