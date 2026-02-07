import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { isLocalhost } from "../auth";
import Countdown from "../components/Countdown";

const Monitoring = () => {
  const navigate = useNavigate();

  if (!isLocalhost) {
    return (
      <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md flex flex-col items-center space-y-4 mt-8">
        <h1 className="text-2xl font-bold text-red-700">Accès refusé</h1>
        <p className="text-gray-500 text-sm italic">
          Cette page n'est accessible qu'en local.
          <br />
          Redirection automatique dans{" "}
          <Countdown
            seconds={7}
            onEnd={() => navigate("/")}
            render={(count) => `${count} seconde${count === 1 ? "" : "s"}...`}
          />
        </p>
        <Link
          to="/"
          className="mt-4 text-blue-600 hover:text-blue-500 underline"
        >
          Retour IMMÉDIAT à l'accueil
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md flex flex-col items-center space-y-4 mt-8">
      <h1 className="text-2xl font-bold text-purple-700">Monitoring (local)</h1>
      <p className="text-gray-500 text-sm italic">
        Cette page de monitoring n'est accessible qu'en local (localhost ou
        127.0.0.1).
      </p>
      <p className="text-gray-500 text-sm italic">
        À venir: Grille de miniautures de quelques URLS clés (Local - Remote -
        API) pour faciliter le debug et la surveillance.
      </p>
      <div className="mt-2 text-green-700">
        Environnement local détecté. Monitoring activé.
      </div>
      <Link to="/" className="mt-4 text-blue-600 hover:text-blue-500 underline">
        Retour à l'accueil
      </Link>
    </div>
  );
};

export default Monitoring;
