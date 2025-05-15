"use client";
import { useState } from 'react';
import TransactionModal from './TransactionModal';
import Link from "next/link";

export default function DailyActivity({ activity, index }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const bgcolor = Number(activity.endingBalance) < 0 
    ? 'red' 
    : Number(activity.endingBalance) < Number(activity.startingBalance) 
      ? 'orange' 
      : 'lightgreen';

  return (
    <div>
      <div
        key={index}
        style={{ background: bgcolor, cursor: 'pointer' }} // CHANGED: add cursor pointer
        className="p-3 rounded"
        onClick={() => setIsModalOpen(true)} // CHANGED: add onClick to parent div
      >
        <div className="grid grid-cols-2 gap-2 mb-2">
          <div>Start: {activity.startingBalance}</div>
          <div>End: {activity.endingBalance}</div>
        </div>
        
        {/* CHANGED: Replace Link with span to keep styling but remove navigation */}
        <span
          className="text-blue-600 hover:text-blue-800 underline cursor-pointer"
        >
          {activity.transactions.length} Transactions
        </span>

        <TransactionModal
          transactions={activity.transactions}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </div>
  );
}
