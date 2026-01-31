import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { authFetch } from "../auth";

const Monitoring = () => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    authFetch("/api/teck")
      .then((res) => res.json())
      .then((data) => {
        if (data.message) setMessage(data.message);
        else setError(data.detail || "Erreur inconnue");
      })
      .catch(() => setError("Erreur réseau"));
  }, []);

  return (
    // <div className="flex items-center justify-center min-h-screen bg-slate-50">
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md flex flex-col items-center space-y-4 mt-8">
      <h1 className="text-2xl font-bold text-purple-700">Monitoring (admin)</h1>
      <p className="text-gray-500 text-sm italic">
        Seuls les <b>ADMINS AUTHENTIFIÉS et EN LOCAL</b> peuvent voir cette page.
      </p>
      <Link to="/" className="mt-4 text-blue-600 hover:text-blue-500 underline">
        Retour à l'accueil
      </Link>
    </div>
    // </div>
  );
};

export default Monitoring;
