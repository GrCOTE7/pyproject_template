// import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import { authFetch } from "../auth";

const Tasks = () => {
  // const [message, setMessage] = useState("");
  // const [error, setError] = useState("");

  return (
    // <div className="flex items-center justify-center min-h-screen bg-slate-50">
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md flex flex-col items-center space-y-4 mt-8">
      <h2 className="text-2xl font-bold text-purple-700">Page Tasks List (admin)</h2>
      <p className="text-gray-500 text-sm italic">
        Seuls les admins authentifiés peuvent voir cete liste.
      </p>
      <Link to="/" className="mt-4 text-blue-600 hover:text-blue-500 underline">
        Retour à l'accueil
      </Link>
    </div>
    // </div>
  );
};

export default Tasks;
