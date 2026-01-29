import { useEffect } from "react";
import { Link } from "react-router-dom";
import { setDocumentTitle } from "../utils/documentTitle";

function NotFound() {
  useEffect(() => {
    const prefix = import.meta.env.DEV ? "L_PPT" : "PPT";
    setDocumentTitle(`${prefix} | 404`);
  }, []);

  return (
    <main className="flex items-center justify-center min-h-screen bg-slate-50 text-slate-800 font-[Roboto]">
      <section className="border max-w-2xl w-full mx-6 p-10 text-center bg-white rounded-2xl shadow-2xl">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
          Erreur 404
        </p>
        <h1 className="text-4xl font-bold text-blue-600 mt-2">
          Page introuvable
        </h1>
        <p className="text-lg text-slate-600 mt-4">
          Cette page n’existe pas ou a été déplacée.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-500"
          >
            Retour à l’accueil
          </Link>
          <Link
            to="/about"
            className="px-5 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100"
          >
            Aller à About
          </Link>
        </div>
      </section>
    </main>
  );
}

export default NotFound;
