import React from "react";

const services = [
  { name: "Service 1" },
  { name: "Service 2" },
  { name: "Service 3" },
  { name: "Service 4" },
  { name: "Service 5" },
  { name: "Service 6" },
];

const genericImg = "https://via.placeholder.com/250x120?text=Miniature";

const Teck = () => {
  // Simule l'état OK/KO (vert/rouge) pour chaque miniature (ici tout OK)
  // À remplacer par un vrai fetch plus tard
  const status = {};
  services.forEach((s) => {
    status[s.name] = { local: true, prod: true };
  });

  // Pour 4 colonnes (2 services par ligne, chaque service = local+prod)
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
            {/* Local 1 */}
            <div className="flex flex-col items-center">
              <img
                src={genericImg}
                alt={`Miniature Local ${pair[0]?.name}`}
                style={{
                  border: `5px solid ${status[pair[0]?.name]?.local ? "green" : "red"}`,
                  borderRadius: 12,
                  width: "99%",
                  height: 264,
                  objectFit: "cover",
                  marginBottom: 8,
                }}
              />
              <span className="label text-xs text-gray-600">Local</span>
              <span className="text-sm font-semibold">{pair[0]?.name}</span>
            </div>
            {/* Prod 1 */}
            <div className="flex flex-col items-center border-r-4 border-gray-300 pr-2">
              <img
                src={genericImg}
                alt={`Miniature Prod ${pair[0]?.name}`}
                style={{
                  border: `5px solid ${status[pair[0]?.name]?.prod ? "green" : "red"}`,
                  borderRadius: 12,
                  width: "99%",
                  height: 264,
                  objectFit: "cover",
                  marginBottom: 8,
                }}
              />
              <span className="label text-xs text-gray-600">Prod</span>
              <span className="text-sm font-semibold">{pair[0]?.name}</span>
            </div>
            {/* Local 2 (début 2e paire, plus de padding ni de bordure) */}
            <div className="flex flex-col items-center ml-2">
              <img
                src={genericImg}
                alt={`Miniature Local ${pair[1]?.name}`}
                style={{
                  border: `5px solid ${status[pair[1]?.name]?.local ? "green" : "red"}`,
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
                  border: `5px solid ${status[pair[1]?.name]?.prod ? "green" : "red"}`,
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
      <p className="text-gray-400 text-xs mt-8 text-center">
        En attente des vraies URLs, miniatures génériques affichées.
      </p>
    </div>
  );
};

export default Teck;
