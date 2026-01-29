const APP_TITLE = "PPT";
const isLocal = import.meta.env.MODE === "development";

export const buildDocumentTitle = (pageTitle) => {
  const fullTitle = `${APP_TITLE} | ${pageTitle}`;
  return isLocal ? `L_${fullTitle}` : fullTitle;
};

export const setDocumentTitle = (pageTitle) => {
  document.title = buildDocumentTitle(pageTitle);
};
