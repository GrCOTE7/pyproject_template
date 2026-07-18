import { useEffect } from "react";
import { Link } from "react-router-dom";
import { setDocumentTitle } from "../utils/documentTitle";

// https://fr.react.dev/learn/typescript#typing-usecontext

export default function Learn6() {
  const subject = "Learn6 - useContext";
  
  useEffect(() => {
    setDocumentTitle(subject);
  }, []);

  return (
    <main className="flex items-center justify-center min-h-screen bg-slate-50 text-slate-800 font-[Roboto]">
      <section className="border max-w-2xl w-full mx-6 p-8 text-center bg-white rounded-2xl shadow-2xl">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">
          {subject}
        </h1>

        {/* <App /> */}

        <div className="mt-6">
          <Link to="/" className="text-blue-600 hover:text-blue-500 underline">
            Retour à l'accueil
          </Link>
        </div>
      </section>
    </main>
  );
}
