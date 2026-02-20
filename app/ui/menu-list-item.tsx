import { MinusIcon, PlusIcon } from "lucide-react";
import { Item } from "@/data/items";

export default function MenuListItem({ item, addToCart, removeFromCart, findItemInCart }: MenuListItemProps) {

    function onAddToCart() {
        if (!isOpenPrice(item.price)) {
            addToCart(item);
            return;
        }
        const input = prompt("Please enter price");
        if (input) {
            item.price = parseFloat(input);
            addToCart(item);
        }
    }

    return item && (
        <li key={item.id} className="even:bg-green-100 odd:bg-green-200">
            <div className="relative aspect-square">
                <figure className="block size-full absolute inset-0 object-center"></figure>
                <p className="absolute top-0 left-0 p-4 text-green-950 uppercase text-2xl font-black">
                    {item.name}
                </p>
                <span className="absolute bottom-2 left-2 p-2 text-green-950 capitalize">
                    {item.category}
                </span>
                <div className="absolute bottom-2 right-2 p-2 flex">
                    <span className="bg-green-400 w-20 uppercase h-12 flex items-center justify-center font-black text-green-950">
                      {isOpenPrice(item.price) ? "Open" : `${item.price}:-`}
                    </span>
                    {findItemInCart(item) && (
                        <button
                            onClick={() => removeFromCart(item)}
                            className="size-12 bg-gray-50 flex items-center justify-center text-gray-950 ml-1 border border-gray-950 active:bg-gray-200"
                        >
                            <MinusIcon className="size-6" />
                        </button>
                    )}
                    <button
                        onClick={onAddToCart}
                        className="size-12 bg-gray-950 flex items-center justify-center hover:bg-gray-800 border border-gray-950 active:bg-gray-700"
                    >
                        <PlusIcon className="size-6" />
                    </button>
                </div>
            </div>
        </li>
    );

}

/** ====================================================================================================================
 * Types
 =====================================================================================================================*/

type MenuListItemProps = {
    item: Item,
    addToCart: (item: Item) => void,
    removeFromCart: (item: Item) => void,
    findItemInCart: (item: Item) => boolean,
}

/** ====================================================================================================================
 * Private utility functions
 =====================================================================================================================*/

function isOpenPrice(price: number | string) {
    return Number(price) === 0;
}