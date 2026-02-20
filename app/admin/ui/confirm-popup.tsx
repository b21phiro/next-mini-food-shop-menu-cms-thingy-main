import {useState} from "react";

export default function ConfirmPopup({ isOpen, title, description, onConfirm, onCancel }: ConfirmPopupProps) {

    return isOpen && (
        <div className="fixed inset-0 z-99 bg-gray-950/80 h-screen w-screen p-8 flex items-center justify-center gap-4">
           <div className="bg-gray-700 shadow border border-gray-950">
               <h4 className="bg-gray-800 p-4 font-bold text-sm">{title ?? "Are you sure?"}</h4>
               <p className="p-4 text-base">{description ?? "Click to proceed and close this popup."}</p>
               <div className="flex">
                   <button className="flex-1 bg-gray-950 h-12 hover:bg-gray-900 transition-colors" onClick={onCancel}>No, cancel</button>
                   <button className="flex-1 bg-slate-300 h-12 hover:bg-slate-50 text-gray-950 transition-colors" onClick={onConfirm}>Yes, proceed</button>
               </div>
           </div>
        </div>
    );

}

/** ====================================================================================================================
 * Types
 =====================================================================================================================*/

type ConfirmPopupProps = {
    isOpen: boolean,
    title?: string,
    description?: string,
    onConfirm: () => void,
    onCancel: () => void
}