import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'node:fs/promises';
import path from 'node:path';
import { type Item } from "@/data/items";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {

        if (!req.body) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const itemsAddedSuccessfully: Item[] = [];
        const incomingJSON = req.body;
        for (const inputData in incomingJSON) {
            const { name, price, category } = incomingJSON[inputData];
            const safePrice = parseFloat(price);
            const safeName = name.replace(/\,/, '').trim(); // Remove comma because it's a CSV delimiter.
            const safeCategory = category.trim();
            if (await findItemByName(safeName)) {
                return res.status(401).json({ message: "Item already exists" });
            }
            const addedItem = await insertItem({ name: safeName, price: safePrice, category: safeCategory });
            if (!addedItem ) {
                return res.status(500).json({ message: "Failed inserting items(s)" });
            }
            itemsAddedSuccessfully.push(addedItem);
        }

        return res.status(200).json({ message: "Item(s) inserted successfully", items: itemsAddedSuccessfully });

    } else if (req.method === 'GET') {

        // Filter by category
        if (req.query.category && typeof req.query.category === 'string') {
            return res.status(200).json({ items: await findItemsByCategory(req.query.category) });
        }

        // ...No filter

        const items = await getData();

        res.status(200).json({ items: items });


    } else if (req.method === 'DELETE') {

        if (!req.body) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const id = parseInt(req.body.id);

        if (!await removeItem(id)) {
            return res.status(500).json({ message: "Failed removing item" });
        }

        res.status(200).json({ message: "Item removed successfully" });


    } else if (req.method === 'PUT') {

        if (!req.body.id || !req.body.name || !req.body.price || !req.body.category) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const id = parseInt(req.body.id);

        if (!await findItemById(id)) {
            return res.status(404).json({ message: "Item not found" });
        }

        const name = req.body.name.replace(/\,/, '').trim();
        const price = parseFloat(req.body.price);
        const category = req.body.category.trim();

        if (!await updateItem(id, { name, price, category })) {
            return res.status(500).json({ message: "Failed updating item" });
        }

        res.status(200).json({ message: "Item updated successfully" });

    } else {

        res.status(405).json({ message: "Not supporting that method >:(" });

    }
}

/** ====================================================================================================================
 * "Private" functions & globals
=====================================================================================================================**/

// Used to generate the next ID for items in
// the CSV file :)
let nextID = 0;

async function insertItem(newItem: { name: string, price: number, category: string }): Promise<Item | void> {
    const file = path.join('db/database.csv');
    const data = new Uint8Array(Buffer.from( ++nextID + ',' + newItem.name + ',' + newItem.price + ',' + newItem.category + "\n"));
    try {
        await fs.writeFile(file, data, { flag: 'a+' });
        return {
            id: nextID,
            name: newItem.name,
            price: newItem.price,
            category: newItem.category
        } // Success :)
    } catch (error) {
        console.error("Failed inserting new-item: ", error);
        return;
    }
}

async function findItemsByCategory(category: string): Promise<{ id: string, name: string, price: string, category: string }[]> {
    if (category.length === 0) return [];
    const items = await getData();
    if (!items || items.length === 0) return [];
    return items.filter(item => item.category === category);
}

async function findItemByName(name: string): Promise<{ id: string, name: string, price: string, category: string } | void> {
    if (name.length === 0) return;
    const items = await getData();
    if (!items || items.length === 0) return;
    return items.find(item => item.name === name);
}

async function findItemById(theId: number): Promise<{ id: string, name: string, price: string, category: string } | void> {
    const items = await getData();
    if (!items || items.length === 0) return;
    return items.find(item => item.id === theId.toString());
}

async function updateItem(idToUpdate: number, newData: { name: string, price: number, category: string }): Promise<boolean> {

    const file = path.join('db/database.csv');

    try {

        // Current string db in the file
        const data = await fs.readFile(file, { encoding: 'utf-8' });

        // Temporary array to hold updated db as well as untouched db
        const updatedData = data
            .split('\n')
            .map(row => {
                const item = row.split(',');
                const id = item[0];
                if (id === idToUpdate.toString()) {
                    return id + ',' + newData.name + ',' + newData.price + ',' + newData.category;
                }
                return row;
            });

        // Replace file contents with updated db
        await fs.writeFile(file, updatedData.join('\n'), { flag: 'w+' });

        // Success

        return true;

    } catch (error) {
        console.error("Failed updating item: ", error);
        return false;
    }

}

async function removeItem(idToRemove: number): Promise<boolean> {
    const file = path.join('db/database.csv');
    try {

        // Current string db in the file
        const data = await fs.readFile(file, { encoding: 'utf-8' });

        // Filter out item with given ID
        const filteredData = data
            .split('\n')
            .filter(row => row.split(',')[0] !== idToRemove.toString());

        // Replace file contents with filtered db
        await fs.writeFile(file, filteredData.join('\n'), { flag: 'w+' });

        // Success
        return true;

    } catch (error) {
        console.error("Failed removing item: ", error);
        return false;
    }
}

async function getData(): Promise<{ id: string, name: string, price: string, category: string }[] | false> {
    const file = path.join('db/database.csv');
    try {
        const data = await fs.readFile(file, { encoding: 'utf-8' });
        const parsedData = [];
        for (let row of data.split('\n')) {
            // Row
            const item = row.split(','),
                  id = item[0],
                  name = item[1],
                  price = item[2],
                  category = item[3];
            if (id === 'id' || id === '') continue; // Is header-line or bad so skip
            // Parsed item
            parsedData.push({ id, name, price, category });
        }
        return parsedData;
    } catch (error) {
        console.error("Failed reading file: ", error);
        return false;
    }
}