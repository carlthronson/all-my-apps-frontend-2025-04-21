// /src/components/FlashCardForm.jsx
'use client';
import { useState } from 'react';
import styles from '@/components/page.module.css';

export default function FlashCardForm() {
  const initialFormState = {
    name: '',
    label: '',
    question: '',
    answer: ''
  };
  const [formData, setFormData] = useState(initialFormState);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = '/api/rest/card';
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setFormData(initialFormState);
      } else {
        alert('There was an error submitting the form: ' + response.statusText);
      }
    } catch (error) {
      alert('Network error. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="name">Name:</label>
      <input
        type="text"
        id="name"
        name="name"
        value={formData.name}
        onChange={handleChange}
      />
      <br /><br />

      <label htmlFor="label">Label:</label>
      <input
        type="text"
        id="label"
        name="label"
        value={formData.label}
        onChange={handleChange}
      />
      <br /><br />

      <label htmlFor="question">Question:</label>
      <textarea
        style={{ width: 800, height: 200 }}
        id="question"
        name="question"
        rows="10"
        required
        value={formData.question}
        onChange={handleChange}
      />
      <br /><br />

      <label htmlFor="answer">Answer:</label>
      <textarea
        style={{ width: 800, height: 200 }}
        id="answer"
        name="answer"
        rows="10"
        required
        value={formData.answer}
        onChange={handleChange}
      ></textarea>
      <br /><br />

      <button type="submit">Submit</button>
    </form>
  );
}

