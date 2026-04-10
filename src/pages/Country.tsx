import type { FC } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import type { Olympic, Participation } from "../types";
import Indicator from "../components/Indicator";
import { Line } from "react-chartjs-2";
import { chartEvolutionData } from "../lib/chartsData";
import { useData } from "../hooks/useData";

const Country: FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error } = useData();
  if (isLoading) return <div>Chargement...</div>;
  if (error || !data) return <Navigate to="/404" replace />;

  const country = data.find((c: Olympic) => c.id === Number(id));
  if (!country) return <Navigate to="/404" replace />;

  const totalMedals = country.participations.reduce((sum: number, p: Participation) => sum + p.medalsCount, 0);
  const totalAthletes = country.participations.reduce((sum: number, p: Participation) => sum + p.athleteCount, 0);
  const totalParticipations = country.participations.length;
  const { evolutionData, evolutionOptions } = chartEvolutionData(country);

  return (
    <div className="min-h-screen bg-white text-black p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate("/")} className="mb-6 text-teal-600 hover:underline text-sm">← Retour</button>
        <div className="flex justify-center mb-6">
          <h1 className="text-white bg-teal-600 px-6 py-2 rounded-lg text-xl md:text-2xl font-light">{country.name}</h1>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <Indicator total={totalParticipations} text={"Number of entries"} />
          <Indicator total={totalMedals} text={"Total number medals"} />
          <Indicator total={totalAthletes} text={"Total number of athletes"} />
        </div>

        <div className="bg-white p-4 md:p-8 rounded-lg">
          <div className="h-64 sm:h-96">
            <Line data={evolutionData} options={evolutionOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Country;
