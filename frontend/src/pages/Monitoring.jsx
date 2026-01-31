import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authFetch, isLocalhost } from "../auth";

// ...existing code...

// ...existing code...

const Monitoring = () => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLocalhost) {
      setError("Accès refusé : Cette page n'est accessible qu'en local.");
      setTimeout(() => navigate("/"), 7000);
    }
  }, [navigate]);

  if (error) {
    return (
      <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md flex flex-col items-center space-y-4 mt-8">
        <h1 className="text-2xl font-bold text-red-700">Accès refusé</h1>
        <p className="text-gray-500 text-sm italic">{error}</p>
        <Link
          to="/"
          className="mt-4 text-blue-600 hover:text-blue-500 underline"
        >
          Retour à l'accueil
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
