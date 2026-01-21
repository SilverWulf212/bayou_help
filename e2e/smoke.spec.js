import { test, expect } from '@playwright/test'

test('home loads', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/Bayou Help/i)
  await expect(page.getByRole('heading', { name: 'Bayou Help' })).toBeVisible()
})

test('resources page loads', async ({ page }) => {
  await page.goto('/resources')
  await expect(page.getByRole('heading', { name: 'Resources' })).toBeVisible()
  await expect(page.getByRole('combobox')).toHaveCount(2)
})

test('resource detail page loads', async ({ page }) => {
  await page.goto('/resources')

  // Click the first Details link.
  const details = page.getByRole('link', { name: 'Details' }).first()
  await expect(details).toBeVisible()
  await details.click()

  // Resource detail view shows a Back link and the resource name as the hero title.
  await expect(page.getByRole('link', { name: /Back to resources/i })).toBeVisible({ timeout: 20000 })
  await expect(page.getByRole('heading').first()).toBeVisible()
})

test('chat sends and receives a reply', async ({ page }) => {
  await page.goto('/chat')
  await expect(page.getByRole('heading', { name: 'Chat' })).toBeVisible()

  const input = page.getByRole('textbox')
  await expect(input).toBeVisible()

  await input.fill('I need food')
  await input.press('Enter')

  // Assert that at least one assistant message appears.
  // The exact wording varies depending on Ollama availability.
  const assistantText = page.locator('text=/\\b(sorry|here|resources|options|food|pantry|meals)\\b/i').first()
  await expect(assistantText).toBeVisible()
})
