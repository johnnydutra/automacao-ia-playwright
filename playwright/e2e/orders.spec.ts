import { test, expect } from '@playwright/test';
import { buildLookupCardLocator, generateOrderCode } from '../support/helpers';

test.describe('Order Lookup', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5173/');
        await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint');
        await page.getByRole('link', { name: 'Consultar Pedido' }).click();
        await expect(page.getByRole('heading')).toContainText('Consultar Pedido');
    });

    test('should look up an approved order', async ({ page }) => {
        // arrange
        const data = {
            order: {
                number: 'VLO-FDBKHQ',
                status: 'APROVADO'
            },
            specs: {
                color: 'Glacier Blue',
                wheels: 'aero Wheels'
            },
            customer: {
                name: 'Johnny Test',
                email: 'test@test.com'
            },
            payment: {
                type: "À Vista"
            }
        }
        
        // act
        await page.getByLabel('Número do Pedido').fill(data.order.number);
        await page.getByRole('button', { name: 'Buscar Pedido' }).click();
        
        // assert
        await expect(page.getByTestId(buildLookupCardLocator(data.order.number))).toMatchAriaSnapshot(`
            - img
            - paragraph: Pedido
            - paragraph: ${data.order.number}
            - status:
                - img
                - text: ${data.order.status}
            `);

        await expect(page.getByTestId(buildLookupCardLocator(data.order.number))).toMatchAriaSnapshot(`
            - img "Velô Sprint"
            - paragraph: Modelo
            - paragraph: Velô Sprint
            - paragraph: Cor
            - paragraph: ${data.specs.color}
            - paragraph: Interior
            - paragraph: cream
            - paragraph: Rodas
            - paragraph: ${data.specs.wheels}
            - heading "Dados do Cliente" [level=4]
            - paragraph: Nome
            - paragraph: ${data.customer.name}
            - paragraph: Email
            - paragraph: ${data.customer.email}
            - paragraph: Loja de Retirada
            - paragraph
            - paragraph: Data do Pedido
            - paragraph: /\\d+\\/\\d+\\/\\d+/
            - heading "Pagamento" [level=4]
            - paragraph: ${data.payment.type}
            - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
            `);

        const statusBadge = page.getByRole('status').filter({ hasText: 'APROVADO' });

        await expect(statusBadge).toContainClass('bg-green-100');

        const statusIcon = statusBadge.locator('svg');
        await expect(statusIcon).toHaveClass(/lucide-circle-check-big/);
    });

    test('should look up a rejected order', async ({ page }) => {
        // arrange
        const data = {
            order: {
                number: 'VLO-9D7M3V',
                status: 'REPROVADO'
            },
            specs: {
                color: 'Glacier Blue',
                wheels: 'aero Wheels'
            },
            customer: {
                name: 'Breno Melo',
                email: 'breno_benjamin_melo@outlook.com'
            },
            payment: {
                type: "À Vista"
            }
        }
 
        // act
        await page.getByLabel('Número do Pedido').fill(data.order.number);
        await page.getByRole('button', { name: 'Buscar Pedido' }).click();
        
        // assert
        await expect(page.getByTestId(buildLookupCardLocator(data.order.number))).toMatchAriaSnapshot(`
            - img
            - paragraph: Pedido
            - paragraph: ${data.order.number}
            - status:
                - img
                - text: ${data.order.status}
            `);

        await expect(page.getByTestId(buildLookupCardLocator(data.order.number))).toMatchAriaSnapshot(`
            - img "Velô Sprint"
            - paragraph: Modelo
            - paragraph: Velô Sprint
            - paragraph: Cor
            - paragraph: ${data.specs.color}
            - paragraph: Interior
            - paragraph: cream
            - paragraph: Rodas
            - paragraph: ${data.specs.wheels}
            - heading "Dados do Cliente" [level=4]
            - paragraph: Nome
            - paragraph: ${data.customer.name}
            - paragraph: Email
            - paragraph: ${data.customer.email}
            - paragraph: Loja de Retirada
            - paragraph
            - paragraph: Data do Pedido
            - paragraph: /\\d+\\/\\d+\\/\\d+/
            - heading "Pagamento" [level=4]
            - paragraph: ${data.payment.type}
            - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
            `);

        const statusBadge = page.getByRole('status').filter({ hasText: 'REPROVADO' });

        await expect(statusBadge).toContainClass('bg-red-100');

        const statusIcon = statusBadge.locator('svg');
        await expect(statusIcon).toHaveClass(/lucide-circle-x/);
    });

    test('should look up an order under analysis', async ({ page }) => {
        // arrange
        const data = {
            order: {
                number: 'VLO-FDBKHQ',
                status: 'EM_ANALISE'
            },
            specs: {
                color: 'Midnight Black',
                wheels: 'aero Wheels'
            },
            customer: {
                name: 'Bruna Santos',
                email: 'bruna_dossantos@brastek.com.br'
            },
            payment: {
                type: "À Vista"
            }
        }

        // act
        await page.getByLabel('Número do Pedido').fill(data.order.number);
        await page.getByRole('button', { name: 'Buscar Pedido' }).click();

        // assert
        await expect(page.getByTestId(buildLookupCardLocator(data.order.number))).toMatchAriaSnapshot(`
            - img
            - paragraph: Pedido
            - paragraph: ${data.order.number}
            - status:
                - img
                - text: ${data.order.status}
            `);

        await expect(page.getByTestId(buildLookupCardLocator(data.order.number))).toMatchAriaSnapshot(`
            - img "Velô Sprint"
            - paragraph: Modelo
            - paragraph: Velô Sprint
            - paragraph: Cor
            - paragraph: ${data.specs.color}
            - paragraph: Interior
            - paragraph: cream
            - paragraph: Rodas
            - paragraph: ${data.specs.wheels}
            - heading "Dados do Cliente" [level=4]
            - paragraph: Nome
            - paragraph: ${data.customer.name}
            - paragraph: Email
            - paragraph: ${data.customer.email}
            - paragraph: Loja de Retirada
            - paragraph
            - paragraph: Data do Pedido
            - paragraph: /\\d+\\/\\d+\\/\\d+/
            - heading "Pagamento" [level=4]
            - paragraph: ${data.payment.type}
            - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
            `);
    
        const statusBadge = page.getByRole('status').filter({ hasText: 'APROVADO' });

        await expect(statusBadge).toContainClass('bg-amber-100');
    
        const statusIcon = statusBadge.locator('svg');
        await expect(statusIcon).toHaveClass(/lucide-clock-icon/);
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
});


