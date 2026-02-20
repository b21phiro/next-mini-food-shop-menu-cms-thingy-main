'use client'

import { type Item } from "@/data/items";
import { useCallback, useState } from "react";

export function useCart() {

    const [itemsInCart, setItemsInCart] = useState<Item[]>([]);

    const addItem = useCallback((item: Item) => {

        if (isOpenPrice(item.price)) {
            return;
        }

        setItemsInCart(prevItems => [...prevItems, item]);
    }, [setItemsInCart]);

    const removeItem = useCallback((item: Item, amount: 'one' | 'all' = 'one') => {

        if (amount === 'all') {
            // Removes all the same items.
            setItemsInCart(prevItems => prevItems.filter(i => i.id !== item.id));
            return;
        }

        setItemsInCart(prevItems => {
            const index = prevItems.findIndex(i => i.id === item.id);
            if (index === -1) return prevItems;
            return [
                ...prevItems.slice(0, index),
                ...prevItems.slice(index + 1),
            ];
        });

    }, [setItemsInCart]);

    const findItem = useCallback((item: Item) => {
        return itemsInCart.some(prevItem => prevItem.id === item.id);
    }, [itemsInCart]);

    return {
        itemsInCart,
        addToCart: addItem,
        removeFromCart: removeItem,
        findItemInCart: findItem
    };

}

/** ====================================================================================================================
 * Private utility functions
 =====================================================================================================================*/

function isOpenPrice(price: number) {
    return price == 0;
}