import { type FC } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement } from "chart.js";
import { Pie } from "react-chartjs-2";
import Indicator from "../components/Indicator";
import { useData } from "../hooks/useData";
import { buildOlympicsChartData } from "../lib/chartsData";
import { useNavigate } from "react-router-dom";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement);

const Home: FC = () => {
  const { data, isLoading, error } = useData();
  const navigate = useNavigate();
  if (isLoading) return <div>Chargement...</div>;
  if (error) return <div>Erreur : {error.message}</div>;
  if (!data) return <div>Aucune donnée</div>;
  const { totalParticipatingCountries, totalGamesEditions, chartData, chartOptions, outlabelsPlugin } = buildOlympicsChartData(data, navigate);

  return (
    <div className="min-h-screen text-black p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-4xl font-bold mb-6">Historique des Jeux Olympiques - TéléSport</h1>

        <div className="mb-6">
          <p className="text-base md:text-lg">
            Bienvenue sur la page dédiée à l'historique des Jeux Olympiques. Explorez les performances des pays au fil des années.
          </p>
        </div>

        <div className="flex justify-center mb-5">
          <h2 className="text-white bg-teal-600 px-6 py-2 rounded-lg text-xl md:text-2xl font-light">Medailles par Pays</h2>
        </div>

        <div className="flex flex-wrap justify-center gap-4 md:gap-10 mb-2">
          <Indicator total={totalParticipatingCountries} text={"Pays participants"} />
          <Indicator total={totalGamesEditions} text={"Éditions des JO"} />
        </div>

        <div className="bg-white p-4 md:p-8 rounded-lg">
          <div className="h-64 sm:h-96">
            <Pie data={chartData} options={chartOptions} plugins={[outlabelsPlugin]} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
