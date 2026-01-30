// Script Node.js à utiliser dans ta CI/CD pour générer un screenshot de la page prod
// Nécessite puppeteer : npm install puppeteer

const puppeteer = require("puppeteer");

(async () => {
  const url = "https://www.cote7.com/";
  const output = "./public/monitoring-screenshots/site-prod.png";
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });
  await page.screenshot({ path: output, fullPage: true });
  await browser.close();
  console.log("Screenshot saved:", output);
})();
