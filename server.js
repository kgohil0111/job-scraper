import express from "express";
import { chromium } from "playwright";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Playwright job scraper running");
});

app.get("/jobs", async (req, res) => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto("https://www.indeed.com/jobs?q=nextjs+developer+freelance&l=Remote");

  const jobs = await page.$$eval("a.tapItem", els =>
    els.slice(0,10).map(el => ({
      title: el.innerText,
      link: "https://www.indeed.com" + el.getAttribute("href")
    }))
  );

  await browser.close();

  res.json(jobs);
});

app.listen(PORT, () => console.log("Server running"));
