import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { setDocumentTitle } from "../utils/documentTitle";
import { isLocalhost } from "../auth";

function Learn2() {
  useEffect(() => {
    setDocumentTitle("Learn 2");
  }, []);
  const [counts, setCounts] = useState({});

  const products = [
    { title: "Chou", isFruit: false, id: 1 },
    { title: "Ail", isFruit: false, id: 2 },
    { title: "Pomme", isFruit: true, id: 3 },
  ];

  const listItems = products.map((product) => {
    const icon = product.isFruit ? "🍎" : "🥦";

    return (
      <li
        key={product.id}
        onClick={() => handleClick(product)}
        style={{
          color: product.isFruit ? "magenta" : "darkgreen",
          fontWeight: product.isFruit ? "bold" : "normal",
        }}
      >
        {icon} {product.title} ({counts[product.id] || 0})
      </li>
    );
  });

  function handleClick(product) {
    const currentCount = counts[product.id] ?? 0;
    const newCount = currentCount + 1;

    console.log(
      `Vous avez cliqué sur '${product.title}' ! - Total : ${newCount} clic${newCount > 1 ? 's' : ''}`,
    );

    setCounts((prev) => ({
      ...prev,
      [product.id]: newCount,
    }));
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-slate-50 text-slate-800 font-[Roboto]">
      <section className="border max-w-2xl w-full mx-6 p-8 text-center bg-white rounded-2xl shadow-2xl">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">Learn 2 - useState</h1>
        <p className="text-lg text-slate-600 font-bold">
          Page de test {isLocalhost && "(Localhost)"}
        </p>

        <ul className="mt-6 text-left ml-50">{listItems}</ul>

        <div className="mt-6">
          <Link to="/" className="text-blue-600 hover:text-blue-500 underline">
            Retour à l'accueil
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Learn2
