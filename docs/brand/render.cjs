// Rasterises the live mark and OG card (dev server must be running).
const fs = require('fs');
const path = require('path');
const { chromium } = require(path.join(__dirname, '../../app/node_modules/playwright'));

(async () => {
  const publicDir = path.join(__dirname, '../../app/public');
  const og = await fetch('http://localhost:3000/api/og');
  if (!og.ok) throw new Error(`api/og ${og.status}`);
  fs.writeFileSync(path.join(publicDir, 'og.png'), Buffer.from(await og.arrayBuffer()));
  console.log('wrote app/public/og.png');

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 512, height: 512 } });
  await page.setContent(
    '<html><body style="margin:0;background:#111726"><img src="http://localhost:3000/icon" width="512" height="512"></body></html>',
  );
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: path.join(publicDir, 'favicon.png') });
  await browser.close();
  console.log('wrote app/public/favicon.png');
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
