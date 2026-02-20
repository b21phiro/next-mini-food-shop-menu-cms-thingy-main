export async function getItems(): Promise<{ items: Item[] }> {
    const response = await fetch('http://localhost:3000/api/items');
    if (!response.ok) throw new Error('Failed to fetch items');
    return response.json();
}

export type Item = {
    id: number,
    name: string,
    price: number,
    category: string
}