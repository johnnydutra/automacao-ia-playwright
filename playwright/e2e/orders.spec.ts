import { test, expect } from '@playwright/test';

test('should look up an approved order', async ({ page }) => {
    const orderLookupCode = 'VLO-FBDKHQ';

    // arrange
    await page.goto('http://localhost:5173/');
    await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint');
    await page.getByRole('link', { name: 'Consultar Pedido' }).click();
    await expect(page.getByRole('heading')).toContainText('Consultar Pedido');

    // act
    await page.getByLabel('Número do Pedido').fill(orderLookupCode);
    await page.getByRole('button', { name: 'Buscar Pedido' }).click();
    
    // assert
    await expect(page.getByTestId('order-result-id')).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId('order-result-id')).toContainText(orderLookupCode);
    await expect(page.getByTestId('order-result-status')).toContainText('APROVADO');
});