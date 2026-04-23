export function generateOrderCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const prefix = 'VLO-';

    let randomized = '';

    for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        randomized += chars[randomIndex];
    }

    return prefix + randomized;
}

export function buildLookupCardLocator(orderNumber: string): string {
    return 'order-result-' + orderNumber;
}