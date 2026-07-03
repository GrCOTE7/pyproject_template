import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { authFetch, isLocalhost } from "../auth";

const isLocal = !isLocalhost; // Forcer le mode localhost pour les tests en dev

const Teck = () => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const abc = !isLocal ? "Mais uniquement en mode dev, en local." : "(Ouvrir MailPit pour voir l'email de test)";

  const [emailResult, setEmailResult] = useState("");

  const runEmailTest = () => {
    authFetch("/api/teck-email")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "ok") setEmailResult(data.output);
        else setEmailResult("Erreur: " + data.output);
      })
      .catch(() => setEmailResult("Erreur réseau"));
  };

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
      <h2 className="text-2xl font-bold text-purple-700">Page Teck (admin)</h2>
      {message && <div className="text-green-700 font-semibold">{message}</div>}
      {error && <div className="text-red-600">{error}</div>}
      <p className="text-gray-500 text-sm italic">
        Seuls les admins authentifiés peuvent voir ce message.
      </p>
      <hr />
      <p>Ci-dessous un bouton pour envoyer un email de test</p>
      <p>{abc}</p>
      {isLocal && (
        <>
          <button
            onClick={runEmailTest}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-500"
          >
            Lancer le test email
          </button>

          {emailResult && (
            <pre className="bg-gray-100 p-3 rounded text-sm mt-4 w-full">
              {emailResult}
            </pre>
          )}
        </>
      )}

      <hr />
      <Link to="/" className="mt-4 text-blue-600 hover:text-blue-500 underline">
        Retour à l'accueil
      </Link>
    </div>
    // </div>
  );
};

export default Teck;
