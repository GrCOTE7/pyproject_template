import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { setDocumentTitle } from "../utils/documentTitle";

// https://fr.react.dev/learn/thinking-in-react



function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);
  return (
    <div>
      <SearchBar
        filterText={filterText}
        inStockOnly={inStockOnly}
        onFilterTextChange={setFilterText}
        onInStockOnlyChange={setInStockOnly}
      />
      <ProductTable
        products={products}
        filterText={filterText}
        inStockOnly={inStockOnly}
      />
    </div>
  );
}

function ProductCategoryRow({ category }) {
  return (
    <tr>
      <th colSpan="2">{category}</th>
    </tr>
  );
}

function ProductRow({ product }) {
  const name = product.stocked ? (
    product.name
  ) : (
    <span style={{ color: "red" }}>{product.name}</span>
  );

  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  );
}

function ProductTable({ products, filterText, inStockOnly }) {
  const rows = [];
  let lastCategory = null;

  products.forEach((product) => {
    if (
      product.name.toLowerCase().indexOf(
        filterText.toLowerCase()
      ) === -1
    ) {
      return;
    }
    if (inStockOnly && !product.stocked) {
      return;
    }
    if (product.category !== lastCategory) {
      rows.push(
        <ProductCategoryRow
          category={product.category}
          key={product.category} />
      );
    }
    rows.push(
      <ProductRow
        product={product}
        key={product.name} />
    );
    lastCategory = product.category;
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Nom</th>
          <th>Prix</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function SearchBar({ filterText, inStockOnly, onFilterTextChange, onInStockOnlyChange }) {
  return (
    <form>
      <input
        type="text"
        placeholder="Recherche..."
        value={filterText}
        onChange={(e) => onFilterTextChange(e.target.value)}
      />
      <label>
        <input
          type="checkbox"
          checked={inStockOnly}
          onChange={(e) => onInStockOnlyChange(e.target.checked)}
        />{" "}
        N’afficher que les produits en stock
      </label>
    </form>
  );
}

const PRODUCTS = [
  { category: "Fruits", price: "1 €", stocked: true, name: "Pomme" },
  { category: "Fruits", price: "1 €", stocked: true, name: "Fruit du dragon" },
  {
    category: "Fruits",
    price: "2 €",
    stocked: false,
    name: "Fruit de la passion",
  },
  { category: "Légumes", price: "2 €", stocked: true, name: "Épinard" },
  { category: "Légumes", price: "4 €", stocked: false, name: "Citrouille" },
  { category: "Légumes", price: "1 €", stocked: true, name: "Petits pois" },
];

function App() {
  return <FilterableProductTable products={PRODUCTS} />;
}

export default function Learn3() {
  useEffect(() => {
    setDocumentTitle("Learn 3 - Produits");
  }, []);

  return (
    <main className="flex items-center justify-center min-h-screen bg-slate-50 text-slate-800 font-[Roboto]">
      <section className="border max-w-2xl w-full mx-6 p-8 text-center bg-white rounded-2xl shadow-2xl">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">Learn3 - Produits</h1>

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
