const puppeteer = require("puppeteer");
const jsonfile = require("jsonfile");
const url = "https://archives.mag2.com/0000102762/00000000000000000.html";

const results = [];
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const options = {
    viewport: {
      width: 1920,
      height: 945
    },
    userAgent:
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36"
  };
  await page.emulate(options);
  await page.goto(url);

  for (let i = 0; i < 1000; i++) {
    console.log(page.url());

    const element = await page.$(
      ".contentWrap > .defaultWidth > .contentWidth > .article-wrap > .title2"
    );
    const title = await page.evaluate(
      element => element.textContent.trim(),
      element
    );
    console.log(title);
    results.push({ url: page.url(), title });
    jsonfile.writeFile(
      "./backnumber.json",
      results,
      {
        encoding: "utf-8",
        replacer: null,
        spaces: null
      },
      function(err) {}
    );

    const navigationPromise = page.waitForNavigation({
      waitUntil: "domcontentloaded"
    });
    await page.click(
      ".contentWrap > .defaultWidth > .contentWidth > .nav-wrap > .nav3"
    );
    await navigationPromise;
  }
})();
