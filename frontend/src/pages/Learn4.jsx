import { useEffect, useReducer } from "react";
import { Link } from "react-router-dom";
import { setDocumentTitle } from "../utils/documentTitle";

// https://fr.react.dev/learn/typescript

const initialState = { count: 0 };

function stateReducer(state, action) {
  switch (action.type) {
    case "reset":
      return initialState;
    case "setCount":
      return { ...state, count: action.value };
    default:
      throw new Error("Unknown action");
  }
}

function CounterApp() {
  const [state, dispatch] = useReducer(stateReducer, initialState);

  const buttonClassName = "px-3 py-1 rounded-sm bg-gray-200";
  const addFive = () => dispatch({ type: "setCount", value: state.count + 5 });
  const reset = () => dispatch({ type: "reset" });

  return (
    <div>
      <h1>Bienvenue dans mon compteur</h1>

      <p>Compteur : {state.count}</p>
      <div className="mt-2 flex items-center justify-center gap-3">
        <button className={buttonClassName} onClick={addFive}>
          Ajouter 5
        </button>
        <button className={buttonClassName} onClick={reset}>
          Réinitialiser
        </button>
      </div>
    </div>
  );
}

export default function Learn4() {
  useEffect(() => {
    setDocumentTitle("Learn 4 - useReducer");
  }, []);

  return (
    <main className="flex items-center justify-center min-h-screen bg-slate-50 text-slate-800 font-[Roboto]">
      <section className="border max-w-2xl w-full mx-6 p-8 text-center bg-white rounded-2xl shadow-2xl">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">
          Learn4 - useReducer
        </h1>

        <CounterApp />

        <div className="mt-6">
          <Link to="/" className="text-blue-600 hover:text-blue-500 underline">
            Retour à l'accueil
          </Link>
        </div>
      </section>
    </main>
  );
}
