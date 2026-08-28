import { test, expect } from '@playwright/test';

test.describe('MyNextJob — Phase 0 smoke', () => {
  test('home page loads with MyNextJob branding and tagline', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('MyNextJob', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Your next job could be here.')).toBeVisible();
  });

  test('bottom navigation is present with all destinations', async ({ page }) => {
    await page.goto('/');
    const nav = page.getByRole('navigation', { name: 'Primary' });
    await expect(nav).toBeVisible();
    for (const label of ['Home', 'Search', 'Saved', 'Activity', 'Profile']) {
      await expect(nav.getByLabel(label, { exact: true })).toBeVisible();
    }
  });

  test('design-system route renders without horizontal overflow', async ({ page }) => {
    await page.goto('/design-system');
    await expect(page.getByRole('heading', { name: /design system/i })).toBeVisible();

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
  });

  test('search input is keyboard-focusable', async ({ page }) => {
    await page.goto('/');
    const search = page.getByLabel('Search jobs');
    await search.focus();
    await expect(search).toBeFocused();
  });
});
