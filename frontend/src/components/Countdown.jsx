import { useEffect, useState } from "react";

/**
 * Affiche un décompte en secondes et appelle onEnd à la fin.
 * @param {number} seconds - Nombre de secondes du décompte
 * @param {function} onEnd - Callback appelé à la fin
 */
export default function Countdown({ seconds, onEnd }) {
  const [count, setCount] = useState(seconds);
  useEffect(() => {
    if (count <= 0) {
      if (onEnd) onEnd();
      return;
    }
    const timer = setTimeout(() => setCount((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [count, onEnd]);
  return <span>{count}</span>;
}
