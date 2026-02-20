'use client'

import React, {useCallback, useEffect, useState} from "react";
import { PlusIcon, XIcon } from "lucide-react";
import { Item } from "@/data/items";
import ConfirmPopup from "@/app/admin/ui/confirm-popup";
import {Categories} from "@/data/categories";

export default function AddItemsModal({ onNewItemsAdded }: AddItemsModalProps) {

    const [ isOpen, setIsOpen ] = useState(false);
    const [ unsavedItems, setUnsavedItems ] = useState<UnsavedItem[]>([]);

    const [ isLoading, setIsLoading ] = useState(false);

    // Fields

    const [ nameInput, setNameInput ] = useState("");
    const [ nameInputError, setNameInputError ] = useState<string>();

    const [ priceInput, setPriceInput ] = useState(0);
    const [ priceInputError, setPriceInputError ] = useState<string>();

    const [ categoryInput, setCategoryInput ] = useState("");
    const [ categoryInputError, setCategoryInputError ] = useState<string>();

    // ===

    // State for confirm-unsaved changes popup.
    const [ isConfirmUnsavedChangesOpen, setIsConfirmUnsavedChangesOpen ] = useState(false);

    function addUnsavedItem() {

        setNameInputError(undefined);
        setCategoryInputError(undefined);
        setPriceInputError(undefined);

        const newItem: UnsavedItem = {
            id: -1, // NO ID.
            name: nameInput,
            price: priceInput,
            category: categoryInput,
        }

        const { isValid, nameError, priceError, categoryError } = validateItem(newItem);

        if (nameExists(newItem.name)) {
            setNameInputError("Item already exists");
            return;
        }

        if (!isValid) {
            if (nameError) setNameInputError(nameError);
            if (categoryError) setCategoryInputError(categoryError);
            if (priceError) setPriceInputError(priceError);
            return;
        }

        setUnsavedItems(prev => [...prev, newItem]);

    }

    function nameExists(name: string): boolean {
        return unsavedItems.some(item => item.name === name);
    }

    function removeUnsavedItem(index: number) {
        setUnsavedItems(prev => prev.filter((_, i) => i !== index));
    }

    function onConfirmUnsavedChanges(wantsToProceed: boolean) {
        if (wantsToProceed === true) {
            setIsConfirmUnsavedChangesOpen(false);
            setIsOpen(false);
        } else {
            setIsConfirmUnsavedChangesOpen(false);
        }
    }

    function onModalClose() {
        if (unsavedItems.length > 0) {
            setIsConfirmUnsavedChangesOpen(true);
        } else {
            setIsOpen(false);
        }
    }

    async function submitItems(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await fetch("/api/items", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(unsavedItems)
            });
            if (!response.ok) throw new Error("Failed to add items");

            const { items } = await response.json();
            onNewItemsAdded?.(items);

            resetForm();
            alert("Successfully added items!");
        } catch (e) {
            console.error(e);
            setIsLoading(false);
            alert("Failed to add items!");
        }
    }

    function resetForm() {
        setIsLoading(false);
        setNameInput("");
        setPriceInput(0);
        setCategoryInput("");
        setUnsavedItems([]);
        setNameInputError(undefined);
        setPriceInputError(undefined);
        setCategoryInputError(undefined);
    }

    // Resets the modal state when it's closed.
    useEffect(() => {
        return () => {
            resetForm();
        }
    }, [isOpen]);

    return (

        <>

            {/* The modal itself */}
            <div className={ !isOpen ? "hidden" : "z-10 fixed inset-0 w-screen h-screen bg-gray-950 flex flex-col"}>

                {/* Head */}
                <div className="flex items-center p-4">

                    <h2 className="text-2xl font-bold">New menu item(s)</h2>

                    <button
                        onClick={onModalClose}
                        className="ml-auto size-12 flex items-center justify-center"
                    >
                        <XIcon className="size-6" />
                    </button>

                </div>

                {/* Body */}
                <form
                    method="dialog"
                    className="flex flex-col p-4 flex-1 gap-4"
                    onSubmit={submitItems}
                >

                    {/* Form fields */}
                    <fieldset className="flex-0 flex flex-col gap-4">

                        <label>
                            <p className="mb-2 text-gray-50">Enter a name</p>
                            <input
                                type="text"
                                className={"p-2 w-full bg-gray-800 border" + (nameInputError ? " border-red-500" : "")}
                                value={nameInput}
                                onChange={e => setNameInput(e.target.value)}
                            />
                            <span className="mt-1 text-xs italic text-gray-50/75">* Will be visible for customers</span>
                        </label>

                        <label>
                            <p className="mb-2 text-gray-50">Select a category</p>
                            <select
                                className={"p-2 w-full bg-gray-800 border " + (categoryInputError ? " border-red-500" : "")}
                                value={categoryInput}
                                onChange={e => setCategoryInput(e.target.value as string)}
                            >
                                <CategoryOptions />
                            </select>
                            <span className="mt-1 text-xs italic text-gray-50/75">
                                * The item will be sorted by given category
                            </span>
                        </label>

                        <label>
                            <p className="mb-2 text-gray-50">Set the price (SEK)</p>
                            <input
                                type="number"
                                className={"p-2 w-full bg-gray-800 border " + (priceInputError ? " border-red-500" : "")}
                                value={priceInput}
                                onChange={e => setPriceInput(Number(e.target.value))}
                            />
                            <span className="mt-1 text-xs italic text-gray-50/75">
                                * Enter 0 to be considered a "open item".
                            </span>
                        </label>

                    </fieldset>

                    {/* Form-to-add items list */}
                    <section className="flex-1 bg-gray-800">
                        <h4 className="font-semibold p-4">New items</h4>
                        <div className="grid grid-cols-4 p-4 bg-gray-700 text-sm">
                            <p>Name</p>
                            <p>Price (SEK)</p>
                            <p>Category</p>
                        </div>
                        <ul>
                            {unsavedItems.map((item, i) =>
                                <li key={i} className="grid grid-cols-4 p-4 bg-gray-700 text-sm items-center">
                                    <p>{item.name}</p>
                                    <p>{item.price}</p>
                                    <p>{item.category}</p>
                                    <button
                                        onClick={() => removeUnsavedItem(i)}
                                        className="size-12 ml-auto hover:bg-gray-800 flex items-center justify-center"
                                    >
                                        <XIcon className="size-6" />
                                    </button>
                                </li>
                            )}
                        </ul>
                    </section>

                    {/* Form button group */}
                    <div className="flex-0 flex gap-4">
                        <button
                            type="button"
                            onClick={addUnsavedItem}
                            title="Add another item"
                            className="size-12 flex-1/4 bg-gray-100 rounded-full text-gray-950 font-bold hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
                            value="Submit new items"
                            disabled={isLoading}
                        >
                            <PlusIcon className="size-6" />
                        </button>
                        <input
                            type="submit"
                            className={"h-12 w-full bg-blue-900 font-bold flex-3/4 transition-colors " + (unsavedItems.length === 0 ? "opacity-50" : "hover:bg-blue-950 opacity-100")}
                            disabled={unsavedItems.length === 0 || isLoading}
                            value="Submit new items"
                        />
                    </div>

                </form>

            </div>

            {/* Open modal button */}
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 font-bold bg-blue-900 p-4 w-full items-center justify-center hover:bg-blue-950 transition-colors"
            >
                Add menu item(s)
                <PlusIcon className="size-6" />
            </button>

            {/* Popup for unsaved changes */}
            <ConfirmPopup
                isOpen={isConfirmUnsavedChangesOpen}
                title="You have unsaved items!"
                description="You have unsaved items, if you close this modal they will be lost. Do you want to proceed?"
                onConfirm={() => onConfirmUnsavedChanges(true)}
                onCancel={() => onConfirmUnsavedChanges(false)}
            />

        </>
    );

}

/** ====================================================================================================================
 * Private utility functions
 =====================================================================================================================*/

function validateItem(item: UnsavedItem): ValidatedItemResult {

    const result: ValidatedItemResult = { isValid: true, nameError: undefined, priceError: undefined, categoryError: undefined };

    if (item.name.length < 3) {
        result.nameError = "Too short";
        result.isValid = false;
    }

    if (!item.category) {
        result.categoryError = "Category is required";
        result.isValid = false;
    }

    if (item.price < 0) {
        result.priceError = "Price cannot be negative";
        result.isValid = false;
    }

    return result;

}

function CategoryOptions() {
    return (
        <>
            <option value="">-- Select a category --</option>
            <option value={Categories.MEAT}>Meat</option>
            <option value={Categories.VEGAN}>Vegan</option>
            <option value={Categories.FISH}>Fish</option>
            <option value={Categories.SIDE}>Side</option>
            <option value={Categories.BEVERAGE}>Beverage</option>
        </>
    )
}

/** ====================================================================================================================
 * Types
 =====================================================================================================================*/

type AddItemsModalProps = {
    onNewItemsAdded?: (newItems: Item[]) => void
}

type UnsavedItem = Item & {}

type ValidatedItemResult = {
    isValid: boolean,
    nameError?: string,
    priceError?: string,
    categoryError?: string,
}