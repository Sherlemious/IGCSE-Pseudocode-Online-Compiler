// Rasterises the live mark (dev server must be running) into public/favicon.png for the manifest and email.
const path = require('path');
const { chromium } = require(path.join(__dirname, '../../app/node_modules/playwright'));

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 512, height: 512 } });
  await page.setContent(
    '<html><body style="margin:0;background:#111726"><img src="http://localhost:3000/icon" width="512" height="512"></body></html>',
  );
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: path.join(__dirname, '../../app/public/favicon.png') });
  await browser.close();
  console.log('wrote app/public/favicon.png');
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
