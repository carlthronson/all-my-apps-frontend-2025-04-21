import React, { useState, useEffect } from 'react';
import './style.css';
import { useCollapse } from 'react-collapsed';

export default function DailyActivity({ activity, index }) {
  const { getCollapseProps, getToggleProps, isExpanded } = useCollapse()
  let bgcolor = Number(activity.endingBalance) < 0.0 ? 'red' : (Number(activity.endingBalance) < Number(activity.startingBalance) ? 'orange' : 'lightgreen');

  return (
    <div>
      <div key={index} style={{ background: bgcolor }}>
        <ul>
          <li>Date: {activity.date}</li>
          <li>Starting Balance: {activity.startingBalance}</li>
          <li>Ending Balance: {activity.endingBalance}</li>
          <br></br>
          {/* Changed from Link to button */}
          <button
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              color: 'blue',
              textDecoration: 'underline',
              cursor: 'pointer',
              font: 'inherit'
            }}
            {...getToggleProps()}
          >
            {isExpanded ? 'Collapse' : 'Transactions'}
          </button>
          <section {...getCollapseProps()}>
            {activity.transactions.map((transaction, index) => (
              <li key={index}>
                {transaction.amount} - {transaction.name} - {transaction.dayOfMonth}
              </li>
            ))}
          </section>
        </ul>
      </div>
    </div>
  )
}
