import { Page } from "@playwright/test";

export class OrderLookupPage {
    constructor(private page: Page) {}

    async searchOrder(orderKey: string) {
        await this.page.getByRole('textbox', { name: 'Número do Pedido' }).fill(orderKey);
        await this.page.getByRole('button', { name: 'Buscar Pedido' }).click();
    }
}