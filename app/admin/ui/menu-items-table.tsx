'use client'

import { type Item } from "@/data/items";
import AddItemsModal from "@/app/admin/ui/add-items-modal";
import {useState} from "react";
import { XIcon, PencilIcon } from "lucide-react";
import ConfirmPopup from "@/app/admin/ui/confirm-popup";

export default function MenuItemsTable({ items }: { items: Item[] }) {

    const [ itemsList, setItemsList ] = useState<Item[]>(items);

    // Confirm popup for unsaved changes.
    const [ isConfirmDeletePopupOpen, setIsConfirmDeletePopupOpen ] = useState(false);
    const [ deleteItemId, setDeleteItemId ] = useState<number>(-1);

    async function onConfirmDelete(wantsToProceed: boolean) {
        if (!wantsToProceed) return setIsConfirmDeletePopupOpen(false);
        if (deleteItemId === -1) return;
        await deleteItem(deleteItemId);
        setIsConfirmDeletePopupOpen(false);
        setDeleteItemId(-1);
    }

    async function onDeleteItem(id: number) {
        setIsConfirmDeletePopupOpen(true);
        setDeleteItemId(id);
    }

    async function deleteItem(id: number) {
        try {
            await fetch(`/api/items`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id })
            });
            setItemsList(itemsList.filter(item => item.id !== id));
        } catch (e) {
            console.error(e);
            alert("Failed to delete item!");
        }
    }

    return (
        <>

            <AddItemsModal onNewItemsAdded={(newItems: Item[]) => setItemsList([...itemsList, ...newItems])} />

            <ConfirmPopup
                isOpen={isConfirmDeletePopupOpen}
                onConfirm={() => onConfirmDelete(true)}
                onCancel={() => onConfirmDelete(false)}
                title="Delete item?"
                description="This action cannot be undone. Do you want to proceed? The item will be permanently deleted."
            />

            <div>
                <div className="grid grid-cols-4 bg-gray-800 p-4">
                    <p className="font-bold">Name</p>
                    <p className="font-bold">Price (SEK)</p>
                    <p className="font-bold text-end">Category</p>
                </div>
                <ul>
                    {itemsList.map(item =>
                        <li key={item.id}
                            className="grid grid-cols-4 p-4 bg-gray-700 text-sm items-center"
                        >
                            <span>{item.name}</span>
                            <span>{item.price}</span>
                            <span className="text-end">{item.category}</span>
                            <div className="flex justify-end">
                                <button
                                    onClick={() => onDeleteItem(item.id)}
                                    className="size-12 hover:bg-gray-800 flex items-center justify-center"
                                >
                                    <XIcon className="size-6" />
                                </button>
                                <button
                                    className="size-12 hover:bg-gray-800 flex items-center justify-center"
                                >
                                    <PencilIcon className="size-4" />
                                </button>
                            </div>
                        </li>
                    )}
                </ul>
            </div>
        </>
    );

}