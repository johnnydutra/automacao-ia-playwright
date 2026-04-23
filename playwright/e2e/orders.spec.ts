import { test, expect } from '@playwright/test';
import { generateOrderCode } from '../support/helpers';

test.describe('Order Lookup', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5173/');
        await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint');
        await page.getByRole('link', { name: 'Consultar Pedido' }).click();
        await expect(page.getByRole('heading')).toContainText('Consultar Pedido');
    });

    test('should look up an approved order', async ({ page }) => {
        // arrange
        const orderLookupCode = 'VLO-FBDKHQ';
        
        // act
        await page.getByLabel('Número do Pedido').fill(orderLookupCode);
        await page.getByRole('button', { name: 'Buscar Pedido' }).click();
        
        // assert
        // await expect(page.getByTestId('order-result-id')).toBeVisible({ timeout: 10000 });
        // await expect(page.getByTestId('order-result-id')).toContainText(orderLookupCode);
        // await expect(page.getByTestId('order-result-status')).toContainText('APROVADO');
        await expect(page.locator('//p[text()="Pedido"]/following-sibling::p')).toContainText(orderLookupCode);
        await expect(page.locator('//div[text()="APROVADO"]')).toBeVisible();
    });

    test('should display an error message when the order is not found', async ({ page }) => {
        // arrange
        const orderLookupCode = generateOrderCode();
    
        // act
        await page.getByLabel('Número do Pedido').fill(orderLookupCode);
        await page.getByRole('button', { name: 'Buscar Pedido' }).click();
    
        // assert
        // const title = page.getByRole('heading', { name: 'Pedido não encontrado' });
        // const message = page.locator('p', { hasText: 'Verifique o número do pedido e tente novamente' });
    
        // await expect(title).toBeVisible();
        // await expect(message).toBeVisible();
    
        await expect(page.locator('#root')).toMatchAriaSnapshot(`
            - img
            - heading "Pedido não encontrado" [level=3]
            - paragraph: "Verifique o número do pedido e tente novamente"
            `);
    });

    test('should use snapshots to validate order', async ({ page }) => {
        // arrange
        const orderLookupCode = 'VLO-FBDKHQ';
        const targetTestId = 'order-result-' + orderLookupCode;
        
        // act
        await page.getByLabel('Número do Pedido').fill(orderLookupCode);
        await page.getByRole('button', { name: 'Buscar Pedido' }).click();

        // assert
        await expect(page.getByTestId(targetTestId)).toMatchAriaSnapshot(`
            - img
            - paragraph: Pedido
            - paragraph: ${orderLookupCode}
            - img
            - text: APROVADO
            `);

          await expect(page.getByTestId(targetTestId)).toMatchAriaSnapshot(`
            - img "Velô Sprint"
            - paragraph: Modelo
            - paragraph: Velô Sprint
            - paragraph: Cor
            - paragraph: Glacier Blue
            - paragraph: Interior
            - paragraph: cream
            - paragraph: Rodas
            - paragraph: aero Wheels
            - heading "Dados do Cliente" [level=4]
            - paragraph: Nome
            - paragraph: Johnny Test
            - paragraph: Email
            - paragraph: test@test.com
            - paragraph: Loja de Retirada
            - paragraph
            - paragraph: Data do Pedido
            - paragraph: /\\d+\\/\\d+\\/\\d+/
            - heading "Pagamento" [level=4]
            - paragraph: À Vista
            - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
            `);
    })
});


