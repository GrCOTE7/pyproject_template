import { useEffect, useContext, createContext, useState } from "react";
import { Link } from "react-router-dom";
import { setDocumentTitle } from "../utils/documentTitle";

// https://fr.react.dev/learn/typescript#typing-usecontext

type Theme ='light' | 'dark' | 'system';
const ThemeContext = createContext<Theme>("system");

// Permet de diffuser des données à travers l’arbre de composants sans avoir à les faire percoler explicitement via chaque niveau intermédiaire.  On l’utilise pour créer un composant fournisseur, en définissant le plus souvent un Hook dédié pour en consommer la valeur dans un composant descendant.
const useGetTheme = () => useContext(ThemeContext);

function App(){
  return (
    <div>
      Oki
    </div>
  );
}

function MyApp() {
  const [theme, setTheme] = useState<Theme>('dark');

  return (
    <ThemeContext.Provider value={theme}>
      <MyComponent />
    </ThemeContext.Provider>
  )
}

function MyComponent() {
  const theme = useGetTheme();

  return (
    <div>
      <p>Thème actif : {theme.charAt(0).toUpperCase() + theme.slice(1)}</p>
    </div>
  )
}

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

        <MyApp />

        <div className="mt-6">
          <Link to="/" className="text-blue-600 hover:text-blue-500 underline">
            Retour à l'accueil
          </Link>
        </div>
      </section>
    </main>
  );
}
