'use client'

import Cart from "./cart/cart";
import { type Item } from "@/data/items";
import { useCart } from "@/app/ui/cart/useCart";
import Checkout from "@/app/ui/checkout";
import {useState} from "react";
import MenuListItem from "@/app/ui/menu-list-item";

export default function Menu({ items }: { items: Item[] }) {

    const {
        addToCart,
        removeFromCart,
        itemsInCart,
        findItemInCart,
    } = useCart();

    const [ isCheckoutOpen, setIsCheckoutOpen ] = useState(false);

    return (
        <>
            <section className="flex-1 p-2">
                <ul className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {items.map(item => (
                        <MenuListItem
                            key={item.id}
                            item={item}
                            addToCart={addToCart}
                            removeFromCart={removeFromCart}
                            findItemInCart={findItemInCart}
                        />
                    ))}
                </ul>
            </section>
            <section className="sticky px-2 py-4 bottom-0 left-0 w-full bg-gray-950 flex">
                <Cart
                    items={itemsInCart}
                    onProceedToCheckout={() => setIsCheckoutOpen(true)}
                />
            </section>

            <Checkout
                itemsInCart={itemsInCart}
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
                onRemoveItem={removeFromCart}
                onAddItem={addToCart}
                onRemoveAllItems={(item) => removeFromCart(item, "all")}
            />

        </>
    );

}
