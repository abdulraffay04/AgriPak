// routes/priceRoutes.js
// const express = require("express");
// const router = express.Router();
// const puppeteer = require("puppeteer");

// router.get("/", async (req, res) => {
//   try {
//     const browser = await puppeteer.launch({
//       headless: true,
//       args: ["--no-sandbox", "--disable-setuid-sandbox"]
//     });

//     const page = await browser.newPage();
//     await page.goto("https://par.com.pk/", { waitUntil: "networkidle0", timeout: 0 });

//     await page.waitForSelector(".clickable-tab", { timeout: 15000 });

//     const tabCount = await page.evaluate(() =>
//       document.querySelectorAll(".clickable-tab").length
//     );

//     const allData = [];

//     for (let i = 0; i < tabCount; i++) {
//       await page.evaluate((i) => {
//         document.querySelectorAll(".clickable-tab")[i].click();
//       }, i);

//       await new Promise(resolve => setTimeout(resolve, 3000));

//       const commodityName = await page.evaluate((i) => {
//         return document.querySelectorAll(".clickable-tab span")[i].innerText.trim();
//       }, i);

//       const hasTable = await page.$("#price-discovery-table table tbody tr");
//       if (!hasTable) continue;

//       await page.waitForSelector("#price-discovery-table table tbody tr", { timeout: 20000 });

//       const data = await page.evaluate(() => {
//         const rows = document.querySelectorAll("#price-discovery-table table tbody tr");
//         const result = [];

//         rows.forEach(row => {
//           const cells = row.querySelectorAll("td");
//           if (cells.length >= 7) {
//             result.push({
//               product_en: cells[0]?.innerText.trim(),
//               product_ur: cells[1]?.innerText.trim(),
//               province: cells[2]?.innerText.trim(),
//               min: cells[4]?.innerText.trim(),
//               max: cells[5]?.innerText.trim(),
//               avg: cells[6]?.innerText.trim()
//             });
//           }
//         });

//         return result;
//       });

//       const tagged = data.map(row => ({ commodity: commodityName, ...row }));
//       allData.push(...tagged);
//     }

//     await browser.close();
//     res.json(allData);

//   } catch (error) {
//     console.error("❌ Error scraping data:", error.message);
//     res.status(500).json({ error: "Scraping failed" });
//   }
// });

// module.exports = router;













const express = require("express");
const router = express.Router();
const puppeteer = require("puppeteer");
const Price = require("../models/Price");

// Helper to get start of day
const startOfDay = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

router.get("/", async (req, res) => {
  try {
    // 1. Serve today's data if exists
    const todayData = await Price.find({ date: { $gte: startOfDay() } });
    if (todayData.length > 0) {
      console.log("✅ Serving from MongoDB");
      return res.json(todayData);
    }

    console.log("🌐 Scraping fresh data...");

    // 2. Launch Puppeteer with proper args for cloud
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--disable-gpu",
      ],
    });

    const page = await browser.newPage();
    await page.goto("https://par.com.pk/", { waitUntil: "networkidle0", timeout: 0 });
    await page.waitForSelector(".clickable-tab", { timeout: 15000 });

    const tabCount = await page.evaluate(() => document.querySelectorAll(".clickable-tab").length);
    const allData = [];

    for (let i = 0; i < tabCount; i++) {
      await page.evaluate((i) => {
        document.querySelectorAll(".clickable-tab")[i].click();
      }, i);

      await page.waitForTimeout(3000); // wait for table to load

      const commodityName = await page.evaluate(
        (i) => document.querySelectorAll(".clickable-tab span")[i].innerText.trim(),
        i
      );

      const hasTable = await page.$("#price-discovery-table table tbody tr");
      if (!hasTable) continue;

      await page.waitForSelector("#price-discovery-table table tbody tr", { timeout: 20000 });

      const data = await page.evaluate(() => {
        return Array.from(document.querySelectorAll("#price-discovery-table table tbody tr")).map(
          (row) => {
            const cells = row.querySelectorAll("td");
            if (cells.length >= 7) {
              return {
                product_en: cells[0]?.innerText.trim(),
                product_ur: cells[1]?.innerText.trim(),
                province: cells[2]?.innerText.trim(),
                min: cells[4]?.innerText.trim(),
                max: cells[5]?.innerText.trim(),
                avg: cells[6]?.innerText.trim(),
              };
            }
            return null;
          }
        ).filter(Boolean);
      });

      const tagged = data.map((row) => ({ commodity: commodityName, ...row }));
      allData.push(...tagged);
    }

    await browser.close();

    // 3. Delete old data
    await Price.deleteMany({});

    // 4. Save new data
    const saved = await Price.insertMany(allData);

    console.log("💾 Saved fresh data to MongoDB");
    res.json(saved);
  } catch (error) {
    console.error("❌ Error scraping data:", error.message);
    res.status(500).json({ error: "Scraping failed" });
  }
});

module.exports = router;
