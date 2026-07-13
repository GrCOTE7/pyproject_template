import { useEffect } from "react";
import { Link } from "react-router-dom";
import { setDocumentTitle } from "../utils/documentTitle";

function About() {
  useEffect(() => {
    setDocumentTitle("Learn");
  }, []);

  const buttonStyle =
    "button bg-yellow-100 text-blue-600 px-2 py-1 rounded hover:bg-blue-100 hover:text-blue-800 hover:font-bold transition-colors duration-700";

  function AButtonWithoutAction() {
    return (
      <button className={buttonStyle}>Je suis un bouton sans action</button>
    );
  }

  const user = { firstname: "Alice", lastname: "Smith" };

  return (
    <>
      <main className="flex items-center justify-center min-h-screen bg-slate-50 text-slate-800 font-[Roboto]">
        <section className="border max-w-2xl w-full mx-6 p-8 text-center bg-white rounded-2xl shadow-2xl">
          <h1 className="text-3xl font-bold text-blue-600 mb-4">Learn</h1>
          <p className="text-lg text-slate-600 font-bold">Page de test</p>

          <div className="mt-6">
            <AButtonWithoutAction />
          </div>

          <div className="mt-6">
            {user.firstname}
            <br />
            {user.lastname}
          </div>

          <div className="mt-6">
            <Link
              to="/"
              className="text-blue-600 hover:text-blue-500 underline"
            >
              Retour à l'accueil
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}

export default About;
