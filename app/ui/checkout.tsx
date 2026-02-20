'use client'

import { type Item } from "@/data/items";
import { ArrowLeft, Check, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import CheckoutLineItem from "./checkout-line-item";
import {sum} from "@/data/common";

export default function Checkout({ isOpen, itemsInCart, onClose, onRemoveItem, onAddItem, onRemoveAllItems }: CheckoutProps) {

    const [ amountOfEachItem, setAmountOfEachItem ] = useState<AmountOfEachItem>();

    function getItem(id: number) {
        return itemsInCart.find(item => item.id == id);
    }

    useEffect(() => {
        setAmountOfEachItem(getAmountOfEachItems(itemsInCart));
    }, [itemsInCart]);

    return isOpen && (
        <>
            <div
                className="bg-gray-950 fixed inset-0 z-10 h-screen w-screen p-2"
            >
                <form className="max-w-5xl mx-auto flex flex-col gap-2 h-full pb-12">

                    <div className="flex gap-4 px-2 py-4">
                        <ShoppingCart className="size-8" />
                        <h2 className="text-2xl font-black">
                            Checkout
                        </h2>
                    </div>

                    <ul className="flex-1">
                        {amountOfEachItem && Object.entries(amountOfEachItem).map(([itemId, amount]) => (
                            <CheckoutLineItem
                                key={itemId}
                                /**
                                 * "!" Is safe because the records are derived
                                 * from the items within the checkout anyway
                                 */
                                item={getItem(Number(itemId))!}
                                amount={amount}
                                onRemoveItem={onRemoveItem}
                                onAddItem={onAddItem}
                                onRemoveAllItems={onRemoveAllItems}
                            />
                        ))}
                    </ul>

                    <div className="border-t border-gray-900 pb-12 pt-4">

                        <p>Total sum: {sum(...itemsInCart.map(item => item.price)) + ":-" }</p>

                    </div>

                    <div className="flex">

                        <button
                            onClick={() => onClose?.()}
                            type="button"
                            className="border hover:bg-gray-900 border-black bg-black size-12 flex items-center justify-center"
                        >
                            <ArrowLeft className="size-6" />
                        </button>

                        <label
                            className="size-12 flex items-center justify-center flex-1 border hover:bg-green-300 bg-green-400 text-gray-900 font-black uppercase gap-4"
                        >
                            <p>Pay and send order</p>
                            <Check className="size-6" />
                            <input className="hidden" type="submit" name="send-order" aria-hidden="true" />
                        </label>

                    </div>

                </form>
            </div>
        </>
    );
}

/** ====================================================================================================================
 * Types
 =====================================================================================================================*/

type CheckoutProps = {
    itemsInCart: Item[],
    isOpen: boolean,
    onClose?: () => void,
    onRemoveItem: (item: Item) => void,
    onAddItem: (item: Item) => void,
    onRemoveAllItems: (item: Item) => void,
};

// Item ID -> Amount
type AmountOfEachItem = Record<number, number>;

/** ====================================================================================================================
 * Private utility functions
 =====================================================================================================================*/

function getAmountOfEachItems(items: Item[]) {
    return items.reduce((accumulator, item) => {
        accumulator[item.id] = (accumulator[item.id] || 0) + 1;
        return accumulator;
    }, {} as AmountOfEachItem); // Item ID and the amount
}
