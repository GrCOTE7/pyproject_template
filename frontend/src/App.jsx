import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import HelloWorld from "./Hello";
import { useBackendStatus } from "./context/BackendContext";
import {
  authFetch,
  clearTokens,
  hasValidSession,
  login,
  getTokens,
} from "./auth";
import { setDocumentTitle } from "./utils/documentTitle";

function App() {
  // Payloads (contenu utile) de réponse de l'API backend
  const [message, setMessage] = useState("Loading...");
  const { isConnected } = useBackendStatus();
  const [isAuthenticated, setIsAuthenticated] = useState(hasValidSession());
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState("");
  const [loggedUsername, setLoggedUsername] = useState("");
  const [adminNote, setAdminNote] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setDocumentTitle("Accueil");
  }, []);

  const getLoginErrorMessage = (err) => {
    const raw = (err?.message || "").trim();
    if (raw === "Missing credentials") {
      return "Merci de saisir un identifiant ET un mot de passe.";
    }
    if (raw === "Invalid credentials") {
      return "Identifiants incorrects.";
    }
    if (raw === "Login failed") {
      return "Connexion impossible. Réessaie.";
    }
    return raw || "Connexion impossible.";
  };

  useEffect(() => {
    if (!isAuthenticated) {
      setIsAdmin(false);
      return;
    }

    // Décoder le token pour déterminer si admin
    try {
      const { accessToken } = getTokens();
      if (accessToken) {
        const payload = JSON.parse(atob(accessToken.split(".")[1]));
        setIsAdmin(
          !!payload?.is_superuser ||
            (Array.isArray(payload?.roles) && payload.roles.includes("admin")),
        );
      } else {
        setIsAdmin(false);
      }
    } catch {
      setIsAdmin(false);
    }

    authFetch("/api/admin/hello")
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(data.detail || "Unauthorized");
        }
        return data;
      })
      .then((data) => {
        setMessage(data.message);
        setLoggedUsername(data.username || "");
        setAdminNote(data.admin_note || "");
      })
      .catch((err) => {
        const raw = (err?.message || "Unauthorized").trim();
        setMessage(raw || "Unauthorized");
        setLoggedUsername("");
        setAdminNote("");
      });
  }, [isAuthenticated]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await login(username, password);
      setIsAuthenticated(true);
      setUsername("");
      setPassword("");
    } catch (err) {
      setError(getLoginErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    clearTokens();
    setIsAuthenticated(false);
    setMessage("Loading...");
    setLoggedUsername("");
    setAdminNote("");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 text-slate-800 font-[Roboto] shadow-sm">
      <div className="border min-w-123 max-w-4xl w-3/6 mx-auto p-8 text-center bg-white rounded-2xl shadow-2xl">
        <div className="border-b pb-4 mb-6">
          <h1 className="text-4xl mx-8 font-bold mb-0 text-blue-600">
            PyProject Frontend
          </h1>
          <h2>
            <span className="text-xl italic m-2 text-blue-600">
              (ViteJS + React)
            </span>
            -<span className="text-xl ml-1">v1.0.1</span>
          </h2>
        </div>

        {!isAuthenticated ? (
          <form
            onSubmit={handleLogin}
            className="max-w-md mx-auto text-left bg-slate-50 border border-slate-200 rounded-xl p-6"
          >
            <h2 className="text-xl font-semibold mb-4 text-slate-700">
              Connexion
            </h2>
            <label className="block text-sm font-medium text-slate-600 mb-2">
              Nom d'utilisateur
              <input
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                autoComplete="username"
                placeholder="admin"
              />
            </label>
            <label className="block text-sm font-medium text-slate-600 mb-2">
              Mot de passe
              <input
                type="password"
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                placeholder="••••••••"
              />
            </label>
            {error ? (
              <p className="text-sm text-red-500 mb-3">{error}</p>
            ) : null}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-500 disabled:opacity-50"
            >
              {isLoading ? "Connexion..." : "Se connecter"}
            </button>
          </form>
        ) : (
          <>
            <p className="text-lg mb-4 text-slate-600">
              Backend says
              {loggedUsername ? (
                <>
                  {" "}
                  to{" "}
                  <b>
                    {loggedUsername.charAt(0).toUpperCase() +
                      loggedUsername.slice(1)}
                  </b>
                </>
              ) : null}
              :{" "}
              <span
                className={`font-semibold transition-all duration-500 whitespace-pre-line ${
                  isConnected
                    ? "text-blue-500 px-1"
                    : "bg-red-400/20 rounded-md text-red-500 animate-pulse italic px-1"
                }`}
              >
                {message}
                {adminNote ? (
                  <span className="block italic text-sm text-slate-500">
                    {adminNote}
                  </span>
                ) : null}
              </span>
            </p>
            <button
              type="button"
              onClick={handleLogout}
              className="mb-8 px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100"
            >
              Se déconnecter
            </button>
          </>
        )}

        {isAuthenticated ? (
          <div className="text-lg">
            <HelloWorld />
          </div>
        ) : null}

        <div className="mt-6">
          <Link
            to="/about"
            className="text-blue-600 hover:text-black underline"
          >
            About
          </Link>
          {isAuthenticated && isAdmin && (
            <p className="mt-2">
              <Link
                to="/teck"
                className="text-blue-700 hover:text-blue-800 underline"
              >
                Teck
              </Link>
            </p>
          )}
        </div>
        <hr className="my-4"></hr>
        <p className="text-sm text-slate-500 italic text-right">
          isAuthenticated: <span className="font-mono"><b>{JSON.stringify(isAuthenticated)}</b></span>
          <br />
          isAdmin: <span className="font-mono"><b>{JSON.stringify(isAdmin)}</b></span>
        </p>
      </div>
    </div>
  );
}

export default App;
