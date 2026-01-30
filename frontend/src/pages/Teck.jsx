import React from "react";

const services = [
  {
    name: "Service 1",
    local: "http://localhost:5173",
    prod: "https://www.cote7.com/",
  },
  { name: "Service 2" },
  { name: "Service 3" },
  { name: "Service 4" },
  { name: "Service 5" },
  { name: "Service 6" },
];

const Teck = () => {
  const [prodStatus, setProdStatus] = React.useState(null); // null, true, false
  const genericImg = "https://via.placeholder.com/250x120?text=Miniature";
  const screenshotUrl = "/monitoring-screenshots/site-prod.png";

  React.useEffect(() => {
    fetch("https://www.cote7.com/", { method: "HEAD" })
      .then((res) => setProdStatus(res.ok))
      .catch(() => setProdStatus(false));
  }, []);

  // Affichage en paires (Local/Prod) sur 4 colonnes, 3 lignes
  const pairs = [];
  for (let i = 0; i < services.length; i += 2) {
    pairs.push(services.slice(i, i + 2));
  }

  return (
    <div className="p-2">
      <h2 className="text-2xl font-bold text-purple-700 mb-8 text-center">
        Page Teck (admin) — Miniatures services
      </h2>
      <div className="grid grid-cols-4 gap-0.5">
        {pairs.map((pair, rowIdx) => (
          <React.Fragment key={rowIdx}>
            {/* Local */}
            <div className="flex flex-col items-center">
              {pair[0]?.name === "Service 1" && pair[0].local ? (
                <iframe
                  src={pair[0].local}
                  title="Miniature Local Service 1"
                  style={{
                    border: `5px solid green`,
                    borderRadius: 12,
                    width: "99%",
                    height: 264,
                    marginBottom: 8,
                  }}
                  sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
                />
              ) : (
                <img
                  src={genericImg}
                  alt={`Miniature Local ${pair[0]?.name}`}
                  style={{
                    border: `5px solid green`,
                    borderRadius: 12,
                    width: "99%",
                    height: 264,
                    objectFit: "cover",
                    marginBottom: 8,
                  }}
                />
              )}
              <span className="label text-xs text-gray-600">Local</span>
              <span className="text-sm font-semibold">{pair[0]?.name}</span>
            </div>
            {/* Prod */}
            <div
              className={
                "flex flex-col items-center border-r-4 border-gray-300 pr-2"
              }
            >
              {pair[0]?.name === "Service 1" && pair[0].prod ? (
                <img
                  src={screenshotUrl}
                  alt="Screenshot Prod Service 1"
                  style={{
                    border: `5px solid ${prodStatus === null ? "gray" : prodStatus ? "green" : "red"}`,
                    borderRadius: 12,
                    width: "99%",
                    height: 264,
                    objectFit: "cover",
                    marginBottom: 8,
                  }}
                />
              ) : (
                <img
                  src={genericImg}
                  alt={`Miniature Prod ${pair[0]?.name}`}
                  style={{
                    border: `5px solid green`,
                    borderRadius: 12,
                    width: "99%",
                    height: 264,
                    objectFit: "cover",
                    marginBottom: 8,
                  }}
                />
              )}
              <span className="label text-xs text-gray-600">Prod</span>
              <span className="text-sm font-semibold">{pair[0]?.name}</span>
            </div>
            {/* Local 2 (début 2e paire, plus de padding ni de bordure) */}
            <div className="flex flex-col items-center ml-2">
              <img
                src={genericImg}
                alt={`Miniature Local ${pair[1]?.name}`}
                style={{
                  border: `5px solid green`,
                  borderRadius: 12,
                  width: "99%",
                  height: 264,
                  objectFit: "cover",
                  marginBottom: 8,
                }}
              />
              <span className="label text-xs text-gray-600">Local</span>
              <span className="text-sm font-semibold">{pair[1]?.name}</span>
            </div>
            <div className="flex flex-col items-center">
              <img
                src={genericImg}
                alt={`Miniature Prod ${pair[1]?.name}`}
                style={{
                  border: `5px solid green`,
                  borderRadius: 12,
                  width: "99%",
                  height: 264,
                  objectFit: "cover",
                  marginBottom: 8,
                }}
              />
              <span className="label text-xs text-gray-600">Prod</span>
              <span className="text-sm font-semibold">{pair[1]?.name}</span>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Teck;
