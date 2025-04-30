// components/TransactionModal.tsx
"use client";
import { useEffect, useRef } from 'react';

type Transaction = {
  name: string;
  amount: number;
  dayOfMonth?: number; // Include if your data has this
};

type TransactionModalProps = {
  transactions: Transaction[];
  isOpen: boolean;
  onClose: () => void;
};

export default function TransactionModal({ 
  transactions, 
  isOpen, 
  onClose 
}: TransactionModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }

    // Handle escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    dialog.addEventListener('keydown', handleEscape);
    return () => dialog.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 z-50 rounded-lg p-6 backdrop:bg-black/50 w-full max-w-md mx-auto my-20"
      onClick={(e) => e.target === dialogRef.current && onClose()}
    >
      <div 
        className="bg-white p-6 rounded-lg shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Transaction Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black text-2xl"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <ul className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
          {transactions.map((transaction, index) => (
            <li key={index} className="flex justify-between border-b pb-2">
              <span
                className={`font-mono ${
                  transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {/* {transaction.amount >= 0 ? '+' : ''} */}
                {transaction.amount} - 
              </span>
              <span className="font-medium">{transaction.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </dialog>
  );
}

