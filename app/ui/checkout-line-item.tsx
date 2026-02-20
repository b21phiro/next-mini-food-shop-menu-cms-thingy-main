import { MinusIcon, PlusIcon, TrashIcon } from "lucide-react";
import { Item } from "@/data/items";
import React, { useState } from "react";

export default function CheckoutLineItem({ item, amount, onRemoveItem, onAddItem, onRemoveAllItems }: CheckoutLineItemProps) {

    const [ isClicked, setIsClicked ] = useState(false);

    function addItem(e: React.MouseEvent<HTMLButtonElement>) {
        e.stopPropagation(); // Prevents accidentally hiding the controls when clicking on the button.
        onAddItem?.(item);
    }

    function removeAllItems(e: React.MouseEvent<HTMLButtonElement>) {
        e.stopPropagation(); // Prevents accidentally hiding the controls when clicking on the button.
        onRemoveAllItems?.(item);
    }

    function removeItem(e: React.MouseEvent<HTMLButtonElement>) {
        e.stopPropagation(); // Prevents accidentally hiding the controls when clicking on the button.
        onRemoveItem?.(item);
    }

    return item && (
        <li
            aria-label="Line item"
            onClick={() => setIsClicked(!isClicked)}
            className="flex gap-4 mb-2 items-center border-t border-gray-900 p-2 h-20 hover:bg-gray-800 active:bg-black"
        >

            { !isClicked && (
                /**
                 * The item thumbnail should be hidden if clicked
                 * to make room for the controls that will
                 * be displayed instead.
                 */
                <figure className="aspect-square bg-green-50 size-16"></figure>
            )}

            <div className="flex flex-col gap-1 w-full">
                <div className="flex justify-between items-center gap-4">
                    <div className="flex-1">
                        <p className="font-bold">
                            <span>{amount} x </span>
                            { item.name }
                        </p>
                        <p className="text-xs text-gray-400 capitalize">{ item.category }</p>
                    </div>
                    <div>
                        <p className="text-xs capitalize">
                            { product(item.price, amount) }:-
                        </p>
                    </div>

                    { isClicked && (
                        /** Controls for the line-item */
                        <div className="flex gap-2 z-10">
                            <div className="flex">
                                <button
                                    type="button"
                                    onClick={removeItem}
                                    className="bg-gray-200 hover:bg-white size-12 flex items-center justify-center"
                                >
                                    <MinusIcon className="size-6 stroke-gray-950" />
                                </button>
                                <button
                                    type="button"
                                    onClick={addItem}
                                    className="bg-black size-12 flex items-center justify-center hover:bg-gray-950 border border-black"
                                >
                                    <PlusIcon className="size-6" />
                                </button>
                            </div>
                            <button
                                type="button"
                                onClick={removeAllItems}
                                className="bg-red-400 size-12 flex items-center justify-center"
                            >
                                <TrashIcon className="size-6 stroke-gray-950" />
                            </button>
                        </div>
                    )}

                </div>
            </div>
        </li>
    );
}

/** ====================================================================================================================
 * Types
 =====================================================================================================================*/

type CheckoutLineItemProps = {
    item: Item;
    amount: number;
    onRemoveItem?: (item: Item) => void;
    onAddItem?: (item: Item) => void;
    onRemoveAllItems?: (item: Item) => void;
};

/** ====================================================================================================================
 * Private utility functions
 =====================================================================================================================*/

function product(multiplicand: number, multiplier: number) {
    return multiplicand * multiplier;
}