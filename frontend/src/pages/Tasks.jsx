import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { authFetch, isAdminUser } from "../auth";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      if (!isAdminUser()) {
        setError("Accès refusé : admin requis.");
        return;
      }

      try {
        const res = await authFetch("/auth/tasks/");
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.detail || res.statusText || "Erreur réseau");
        }
        const data = await res.json();
        setTasks(data.tasks || []);
      } catch (err) {
        setError(err.message || String(err));
      }
    };

    load();
  }, []);

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md flex flex-col items-center space-y-4 mt-8">
      <h2 className="text-2xl font-bold text-purple-700">
        Page Tasks Liste (admin)
      </h2>
      <p className="text-gray-500 text-sm italic">
        Seuls les admins authentifiés peuvent voir cette liste.
      </p>

      {error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <ul className="mt-4 list-disc list-inside w-full">
          {tasks.length === 0 ? (
            <li className="text-gray-500">Aucune tâche trouvée.</li>
          ) : (
            tasks.map((t) => (
              <li key={t} className="py-1 border-b w-full">
                <span className="font-medium">{t}</span>
              </li>
            ))
          )}
        </ul>
      )}

      <Link to="/" className="mt-4 text-blue-600 hover:text-blue-500 underline">
        Retour à l'accueil
      </Link>
    </div>
  );
};

export default Tasks;
