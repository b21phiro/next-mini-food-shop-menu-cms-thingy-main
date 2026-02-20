'use client'

import { ShoppingCart } from "lucide-react";
import React from "react";
import { type Item } from "@/data/items";
import { sum } from "@/data/common";

export default function Cart({ items, onProceedToCheckout }: CartProps) {
    return (
        <>
            <div className="border border-green-400 h-12 w-16 font-black items-center justify-center flex">
                <p className="font-black">{ sum(...items.map(item => item.price)) + ":-" }</p>
            </div>
            <button
                onClick={onProceedToCheckout}
                className="relative hover:bg-green-300 bg-green-400 w-full flex items-center justify-center text-base font-bold uppercase text-gray-950 h-12 gap-4"
            >
                Checkout
                <ShoppingCart className="size-6" />
                <span className="absolute size-4 text-[10px] transform translate-y-[-8px] translate-x-[74px] rounded-full">
                    {items.length}
                </span>
            </button>
        </>
    );
}

/** ====================================================================================================================
 * Types
 =====================================================================================================================*/

type CartProps = {
    items: Item[],
    onProceedToCheckout: () => void,
}