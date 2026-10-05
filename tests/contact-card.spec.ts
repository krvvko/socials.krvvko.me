import { expect, test } from '@playwright/test';
import { readFile } from 'node:fs/promises';

for (const [width, height] of [[1440, 900], [1280, 720], [390, 844], [375, 667], [320, 568], [844, 390]]) {
  test(`all content fits ${width}×${height}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    await expect(page.getByRole('heading', { name: /Kostya.*Krauchanka/ })).toBeVisible();
    const bounds = await page.locator('main').boundingBox();
    expect(bounds!.y).toBeGreaterThanOrEqual(0);
    expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(height);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
    expect(await page.evaluate(() => document.documentElement.scrollHeight)).toBe(height);
    for (const element of await page.locator('main a, main button').all()) {
      const box = await element.boundingBox();
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(width);
      expect(box!.y + box!.height).toBeLessThanOrEqual(height);
    }
    await expect.poll(() => page.locator('img').evaluateAll(images => images.every(img => (img as HTMLImageElement).complete && (img as HTMLImageElement).naturalWidth > 0))).toBe(true);
    expect(errors).toEqual([]);
    if (width === 1440 || width === 375) await page.screenshot({ path: `.verification/${width === 1440 ? 'desktop' : 'mobile'}.png` });
  });
}

test('minimal QR dialog opens and restores focus', async ({ page }) => {
  await page.goto('/');
  const trigger = page.getByRole('button', { name: 'Show QR code' });
  await trigger.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.locator('.qr-image')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Let’s stay in touch.' })).toBeVisible();
  await expect(page.getByRole('dialog').getByRole('button')).toHaveCount(1);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page.getByRole('button', { name: 'Close QR code' }).click();
  await expect(trigger).toBeFocused();
});

test('contact file has the right MIME type and details', async ({ request }) => {
  const response = await request.get('/kostya-krauchanka.vcf');
  expect(response.ok()).toBe(true);
  expect(response.headers()['content-type']).toContain('text/vcard');
  const card = await response.text();
  for (const value of ['VERSION:3.0', 'FN:Kostya Krauchanka', 'TEL;TYPE=CELL:+19787273287', 'https://krvvko.me', 'https://discord.com/users/552151232358252563']) expect(card).toContain(value);
  expect(card).not.toMatch(/^(ADR|TITLE)[;:]/m);
});

for (const [timezoneId, expectedDate] of [['America/New_York', 'October 4\\, 2026'], ['Asia/Tokyo', 'October 5\\, 2026']]) {
  test(`vCard uses the visitor's date in ${timezoneId}`, async ({ browser }) => {
    const context = await browser.newContext({ timezoneId });
    const page = await context.newPage();
    await page.clock.install({ time: new Date('2026-10-05T02:00:00Z') });
    await page.goto(process.env.TEST_BASE_URL || 'http://127.0.0.1:8080');
    const downloadEvent = page.waitForEvent('download');
    await page.getByRole('link', { name: 'Add to contacts' }).click();
    const download = await downloadEvent;
    expect(download.suggestedFilename()).toBe('kostya-krauchanka.vcf');
    const card = await readFile((await download.path())!, 'utf8');
    expect(card).toContain(`NOTE:We met at a meetup on ${expectedDate}.`);
    expect(card).not.toMatch(/^(ADR|TITLE)[;:]/m);
    await context.close();
  });
}

test('social destinations include the Discord profile', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'LinkedIn', exact: true })).toHaveAttribute('href', 'https://www.linkedin.com/in/kostya-krauchanka-458288441/');
  await expect(page.getByRole('link', { name: 'Instagram', exact: true })).toHaveAttribute('href', 'https://www.instagram.com/krvvko/');
  await expect(page.getByRole('link', { name: 'GitHub', exact: true })).toHaveAttribute('href', 'https://github.com/krvvko');
  await expect(page.getByRole('link', { name: 'X', exact: true })).toHaveAttribute('href', 'https://x.com/KKrevvetka');
  await expect(page.getByRole('link', { name: 'Discord', exact: true })).toHaveAttribute('href', 'https://discord.com/users/552151232358252563');
  await expect(page.getByRole('link', { name: 'Call +1 (978) 727-3287' })).toHaveAttribute('href', 'tel:+19787273287');
});

test('page uses a plain background with no card container', async ({ page }) => {
  await page.goto('/');
  expect(await page.locator('main').evaluate(element => ({ background:getComputedStyle(element).backgroundImage, shadow:getComputedStyle(element).boxShadow, border:getComputedStyle(element).borderWidth }))).toEqual({background:'none',shadow:'none',border:'0px'});
  await expect(page.locator('.ambient')).toHaveCount(0);
});
