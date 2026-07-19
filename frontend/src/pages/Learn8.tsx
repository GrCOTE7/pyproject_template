import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { setDocumentTitle } from "../utils/documentTitle";

// https://fr.react.dev/learn/typescript#typing-usecallback

// Fournit une référence stable à une fonction tant que les dépendances passées en deuxième argument ne changent pas

function App() {
  return <div>Ready.</div>;
}

function FormSimple() {
  const [value, setValue] = useState("Modifiez-moi");

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setValue(event.currentTarget.value);
  }

  return (
    <>
      <input value={value} onChange={handleChange} />
      <p>Valeur : {value}</p>
    </>
  );
}

function Form() {
  const [value, setValue] = useState("");

  const handleChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>((event) => {
    setValue(event.currentTarget.value);
  }, [setValue])

  return (
    <>
      <input placeholder='Change ICI' value={value} onChange={handleChange} />
      <p>{value ? `Valeur : ${value}` : "Champs vide"}</p>
    </>
  );
}

export default function Learn8() {
  const subject = "Learn8 - useCallback";

  useEffect(() => {
    setDocumentTitle(subject);
  }, []);

  return (
    <main className="flex items-center justify-center min-h-screen bg-slate-50 text-slate-800 font-[Roboto]">
      <section className="border max-w-2xl w-full mx-6 p-8 text-center bg-white rounded-2xl shadow-2xl">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">{subject}</h1>

        {/* <App /> */}
        {/* <FormSimple /> */}
        {/*
        Sans useCallback, la fonction handleChange est recréée à chaque rendu du composant Form.
        Render 1 -> handleChange = Fonction A
        Render 2 -> handleChange = Fonction B
        Render 3 -> handleChange = Fonction C
        */}
        <Form /> 
        {/*
        Render 1 -> Fonction A
        Render 2 -> Fonction A
        Render 3 -> Fonction A

        => ATTENTION: Coût intéressant que si besoin de garder la même identité de fonction entre les rendus.
        */}
        
        <div className="mt-6">
          <Link to="/" className="text-blue-600 hover:text-blue-500 underline">
            Retour à l'accueil
          </Link>
        </div>
      </section>
    </main>
  );
}
