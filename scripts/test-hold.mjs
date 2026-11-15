// End-to-end test of the Hold Request. Usage: node scripts/test-hold.mjs [base]
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const base = process.argv[2] || 'http://localhost:3000';
const b = await chromium.launch();
let ok = true;
const assert = (c, m) => { console.log((c ? '  ok  ' : '  FAIL ') + m); if (!c) ok = false; };

for (const w of [375, 1440]) {
  const mobile = w < 500;
  const ctx = await b.newContext({ viewport: { width: w, height: mobile ? 812 : 900 }, isMobile: mobile, hasTouch: mobile, permissions: ['clipboard-read', 'clipboard-write'] });
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', (e) => errs.push(String(e)));
  await p.goto(base + '/', { waitUntil: 'networkidle' });
  console.log(`--- ${w}px`);

  // 1. No pre-fill, from the hero button
  const heroBtn = p.locator('#hero-title').locator('xpath=ancestor::section').getByRole('button', { name: 'Hold it for me' });
  await heroBtn.click();
  const dlg = p.locator('dialog[open]');
  await dlg.waitFor();
  assert(await dlg.getByText('Step 1 of 3').isVisible(), 'unprefilled starts at Step 1 of 3');
  await dlg.getByRole('button', { name: 'Dinner out look' }).click();
  assert(await dlg.getByText('Step 2 of 3').isVisible(), 'size is Step 2 of 3');
  await dlg.getByRole('button', { name: 'M', exact: true }).click();
  assert(await dlg.getByText('Step 3 of 3').isVisible(), 'day is Step 3 of 3');
  const monday = await dlg.locator('button:disabled').count();
  assert(monday >= 1, `closed days are disabled (${monday})`);
  await dlg.locator('button.chip:not([disabled])').first().click();
  await dlg.getByLabel(/first name/i).fill('Sarah');
  await dlg.getByRole('button', { name: 'Next' }).click();
  assert(await dlg.getByText('Ready to send').isVisible(), 'review screen');
  if (mobile) {
    const a = dlg.getByRole('link', { name: 'Text my request to Style by Dawn' });
    const href = await a.getAttribute('href');
    const body = decodeURIComponent(href.split('body=')[1]);
    console.log('       sms body:', body);
    assert(href.startsWith('sms:+13014613147?&body='), 'sms link format');
    assert(/Dinner out look \(black ribbed dress and cream coat\) in a size M\?/.test(body) && /Thanks, Sarah\. Sent from your website\.$/.test(body), 'message built from answers');
    assert(!(await dlg.getByText("She'll text you back").isVisible()), 'no success message before the tap');
    await a.evaluate((el) => el.addEventListener('click', (e) => e.preventDefault(), { once: true }));
    await a.click();
    assert(await dlg.getByText("Sent to Dawn's phone. She'll text you back.").isVisible(), 'success message after the tap');
    await p.screenshot({ path: `screenshots/tmp/hold-review-${w}.png` });
  } else {
    await p.screenshot({ path: `screenshots/tmp/hold-review-${w}.png` });
    await dlg.getByRole('button', { name: 'Copy my request' }).click();
    assert(await dlg.getByRole('button', { name: 'Copied' }).waitFor({ timeout: 3000 }).then(() => true, () => false), 'desktop copy confirms Copied');
    const clip = await p.evaluate(() => navigator.clipboard.readText());
    assert(clip.startsWith('Hi Dawn! Could you hold the Dinner out look'), 'clipboard has the request');
    const mail = await dlg.getByRole('link', { name: 'Email it to Dawn' }).getAttribute('href');
    assert(mail.startsWith('mailto:mystylebydawn@gmail.com?subject='), 'desktop email link');
  }
  await p.keyboard.press('Escape');
  await p.waitForTimeout(300);
  assert((await p.locator('dialog[open]').count()) === 0, 'Esc closes');
  const focused = await p.evaluate(() => document.activeElement?.textContent?.trim());
  assert(focused === 'Hold it for me', `focus returns to the opener (${focused})`);
  assert(await p.evaluate(() => document.documentElement.style.overflow === ''), 'scroll unlocked');

  // 2. Pre-filled from Stiffany: skips step 1
  await p.getByRole('button', { name: "Hold Stiffany's look" }).click();
  await dlg.waitFor();
  assert(await dlg.getByText('Step 1 of 2').isVisible() && (await dlg.getByText("Stiffany's look").first().isVisible()), 'Stiffany pre-fill skips the item step and shows the piece');
  await dlg.getByRole('button', { name: 'Close' }).click();

  // 3. Pre-filled unsized tile (caps): only the day step
  await p.getByRole('button', { name: /Merry & Bright snapback caps\. Hold it for me/ }).click();
  await dlg.waitFor();
  assert(await dlg.getByText('Step 1 of 1').isVisible(), 'caps skip the size step');
  await dlg.getByRole('button', { name: 'Not sure yet' }).click();
  await dlg.getByRole('button', { name: 'Next' }).click();
  const msg = await dlg.locator('p.rounded-tag').innerText();
  console.log('       caps message:', msg);
  assert(/Could you hold the piece I saw on your website \(Merry & Bright snapback caps\)\? I'm not sure which day/.test(msg), 'unsized message has no size');
  // Back from review returns to day
  await dlg.getByRole('button', { name: 'Back' }).click();
  assert(await dlg.getByText('When can you stop in?').isVisible(), 'Back works');
  if (w === 375) await p.screenshot({ path: `screenshots/tmp/hold-day-${w}.png` });
  await p.keyboard.press('Escape');

  // 4. Styler pre-fill
  await p.evaluate(() => document.getElementById('styler').scrollIntoView());
  await p.getByRole('radio', { name: 'A day in town' }).click();
  await p.getByRole('button', { name: 'Hold this look for me' }).click();
  await dlg.waitFor();
  assert(await dlg.getByText('A day in town look').isVisible(), 'styler pre-fills the selected look');
  await p.keyboard.press('Escape');
  assert(errs.length === 0, 'no page errors ' + errs.join(' | '));
  await ctx.close();
}
await b.close();
console.log(ok ? 'Hold Request: all passed' : 'Hold Request: FAILURES');
process.exit(ok ? 0 : 1);
