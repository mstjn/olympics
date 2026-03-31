import type { FC } from "react";
import { useParams } from "react-router-dom";
import type { Olympic, Participation } from "../types";
import Indicator from "../components/Indicator";
import { Line } from "react-chartjs-2";
import { chartEvolutionData } from "../lib/chartsData";
import { useData } from "../hooks/useData";

const Country: FC = () => {
  const { id } = useParams();
  const { data, isLoading, error } = useData();
  if (isLoading) return <div>Chargement...</div>;
  if (error) return <div>Erreur : {error.message}</div>;
  if (!data) return <div>Aucune donnée</div>;

  const country = data.find((c: Olympic) => c.id === Number(id));
  if (!country) return <div>Pays non trouvé</div>;

  const totalMedals = country.participations.reduce((sum: number, p: Participation) => sum + p.medalsCount, 0);
  const totalAthletes = country.participations.reduce((sum: number, p: Participation) => sum + p.athleteCount, 0);
  const totalParticipations = country.participations.length;
  const { evolutionData, evolutionOptions } = chartEvolutionData(country);

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
