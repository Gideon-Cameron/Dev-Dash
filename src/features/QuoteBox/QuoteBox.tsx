// src/features/QuoteBox/QuoteBox.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Quote {
  content: string;
  author: string;
}

const QuoteBox = () => {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchQuote = async () => {
    try {
      const response = await axios.get<Quote>('https://api.quotable.io/random?tags=technology|inspirational');
      setQuote(response.data);
    } catch (err) {
      setError('Could not load quote.');
      console.error('Quote API error:', err);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  if (error) {
    return (
      <div className="rounded-lg bg-white p-6 shadow-md">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="rounded-lg bg-white p-6 shadow-md">
        <p className="text-gray-500">Loading inspirational quote...</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <blockquote className="text-gray-700 italic">"{quote.content}"</blockquote>
      <p className="mt-4 text-right text-sm text-gray-500">— {quote.author}</p>
    </div>
  );
};

export default QuoteBox;
