import { expect, test } from '@playwright/test';

for (const [width, height] of [[1440, 900], [1280, 720], [390, 844], [375, 667], [320, 568], [844, 390]]) {
  test(`all content fits ${width}×${height}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    await expect(page.getByRole('heading', { name: 'Kostya Krauchanka.' })).toBeVisible();
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
    expect(await page.locator('img').evaluateAll(images => images.every(img => (img as HTMLImageElement).complete && (img as HTMLImageElement).naturalWidth > 0))).toBe(true);
    expect(errors).toEqual([]);
    if (width === 1440 || width === 375) await page.screenshot({ path: `.verification/${width === 1440 ? 'desktop' : 'mobile'}.png` });
  });
}

test('QR dialog opens, downloads, and restores focus', async ({ page }) => {
  await page.goto('/');
  const trigger = page.getByRole('button', { name: 'Show QR code' });
  await trigger.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.locator('.qr-image')).toBeVisible();
  await expect(page.getByText('socials.krvvko.me', { exact: true })).toBeVisible();
  const downloadEvent = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Save QR code' }).click();
  expect((await downloadEvent).suggestedFilename()).toBe('kostya-krauchanka-qr.svg');
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
  for (const value of ['VERSION:3.0', 'FN:Kostya Krauchanka', 'TEL;TYPE=CELL:+19787273287', 'Westford;MA', 'Discord: krvvko', 'https://krvvko.me', 'https://quolly.app/', 'https://techscreen.app/', 'https://mrris.land/']) expect(card).toContain(value);
});

test('social destinations and clipboard are correct', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'LinkedIn', exact: true })).toHaveAttribute('href', 'https://www.linkedin.com/in/kostya-krauchanka-458288441/');
  await expect(page.getByRole('link', { name: 'Instagram', exact: true })).toHaveAttribute('href', 'https://www.instagram.com/krvvko/');
  await expect(page.getByRole('link', { name: 'GitHub', exact: true })).toHaveAttribute('href', 'https://github.com/krvvko');
  await expect(page.getByRole('link', { name: 'X', exact: true })).toHaveAttribute('href', 'https://x.com/KKrevvetka');
  await page.getByRole('button', { name: 'Copy Discord username krvvko' }).click();
  await expect(page.getByRole('status')).toHaveText('Discord username copied');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('krvvko');
});

test('reduced motion disables background movement', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  expect(await page.locator('.ambient-one').evaluate(element => getComputedStyle(element).animationName)).toBe('none');
});
