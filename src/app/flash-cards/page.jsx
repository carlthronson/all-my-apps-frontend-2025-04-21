'use client';
import { useState, useEffect } from 'react';
import styles from '@/components/page.module.css';
import { FlashcardArray } from 'react-quizlet-flashcard';

function transformJsonKeys(obj, keyMap) {
  if (Array.isArray(obj)) {
    return obj.map(item => transformJsonKeys(item, keyMap));
  } else if (typeof obj === 'object' && obj !== null) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => {
        let newKey = keyMap[key] || key;
        return [newKey, value];
      })
    );
  }
  return obj;
}

const keyMap = { question: 'frontHTML', answer: 'backHTML' };

export default function Home() {
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const url = '/api/rest/card/findall?limit=10';
    fetch(url)
      .then((response) => {
        return response.json();
      })
      .then((originalJson) => {
        debugger;
        console.log('original json: ' + JSON.stringify(originalJson));
        const transformedJson = transformJsonKeys(originalJson, keyMap);
        console.log('transformed json: ' + JSON.stringify(transformedJson));
        setCards(transformedJson);
        setIsLoading(false);
      });
  }, []); // Empty dependency array

  return <div className={styles.center}>
    {isLoading ? 'Please wait' :
      <FlashcardArray cards={cards} />
    }
  </div>;
}