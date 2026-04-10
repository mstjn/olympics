import type { FC } from "react";
import { useNavigate } from "react-router-dom";

const NotFound: FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
      <div className="max-w-md text-center">
        <div className="flex justify-center mb-6">
          <span className="text-white bg-teal-600 px-8 py-2 rounded-lg text-2xl font-light">
            Page introuvable
          </span>
        </div>
        <p className="text-gray-500 text-lg mb-8">
          La page que vous cherchez n'existe pas ou le pays demandé est introuvable.
        </p>
        <button
          onClick={() => navigate("/")}
          className="text-teal-600 border-2 border-teal-600 px-6 py-2 rounded-lg hover:bg-teal-600 hover:text-white transition-colors"
        >
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
};

export default NotFound;
