import express from "express";
import { chromium } from "playwright";

const app = express();

app.get("/jobs", async (req, res) => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const jobs = [];

  await page.goto("https://www.indeed.com/jobs?q=nextjs+developer+freelance&l=Remote");

  const results = await page.$$eval("a.tapItem", els =>
    els.slice(0,10).map(el => ({
      title: el.innerText,
      link: "https://indeed.com" + el.getAttribute("href")
    }))
  );

  jobs.push(...results);

  await browser.close();

  res.json(jobs);
});

app.listen(3000);