import React, { useEffect, useState } from "react";
import { useBackendStatus } from "./context/BackendContext";
import { authFetch } from "./auth";

const HelloWorld = () => {
  const [message, setMessage] = useState("");
  const { isConnected } = useBackendStatus();

  useEffect(() => {
    authFetch("/api/hello")
      .then((res) => res.json())
      .then((data) => setMessage(data.message || data.detail || ""))
      .catch((err) => console.error(err));
  }, []);

  // Seuil de caractères pour basculer en affichage sur deux lignes
  const CHAR_LIMIT = 20;
  const isLong = (message || "").length > CHAR_LIMIT;
  // Dynamique : div si long (bloc), p/span si court (inline)
  const Wrapper = isLong ? "div" : "p";
  const Label = isLong ? "div" : "span";

  return (
    <div className="px-3 py-2 bg-linear-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg text-white flex items-center justify-between">
      <Wrapper className="text-md">
        <Label className="text-sm font-bold opacity-80">
          From "Hello.jsx" :
        </Label>
        {!isLong && " "}
        <span
          className={`font-semibold transition-all duration-500 ${
            isConnected
              ? "text-gray-200 px-1"
              : "bg-red-400/20 rounded-md text-blue-100 animate-pulse italic px-1"
          }`}
        >
          {message}
        </span>
        {/* <span className="ml-1 text-blue-50/90">{message}</span> */}
      </Wrapper>
      <span
        className={`ml-4 px-2 py-0.5 rounded-md text-sm font-medium transition-all duration-300 ${
          isConnected
            ? "bg-green-400/20 text-green-400"
            : "bg-red-400/20 text-red-100 italic"
        }`}
      >
        Backend: {isConnected ? "✅" : "❌"}
      </span>
    </div>
  );
};

export default HelloWorld;
