import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { setDocumentTitle } from "../utils/documentTitle";

// https://fr.react.dev/learn/typescript#typing-usememo

// Mémorise les valeurs renvoyées par une fonction, pour ne re-exécuter celle-ci que si les dépendances passées en deuxième paramètre ont changé. Le type du résultat de l’appel au Hook est inféré sur base de la valeur de retour de la fonction passée en premier argument.

// Le type de `visibleTodos` est inféré à partir du type du résultat
// de `filterTodos`
// const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);

function App() {
  return <div>Exemple en commentaire.</div>;
}

export default function Learn7() {
  const subject = "Learn7 - useMemo";

  useEffect(() => {
    setDocumentTitle(subject);
  }, []);

  return (
    <main className="flex items-center justify-center min-h-screen bg-slate-50 text-slate-800 font-[Roboto]">
      <section className="border max-w-2xl w-full mx-6 p-8 text-center bg-white rounded-2xl shadow-2xl">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">{subject}</h1>

        <App />

        <div className="mt-6">
          <Link to="/" className="text-blue-600 hover:text-blue-500 underline">
            Retour à l'accueil
          </Link>
        </div>
      </section>
    </main>
  );
}
