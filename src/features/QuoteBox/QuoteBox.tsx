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
      const response = await axios.get<{ content: string; author: string }>(
        'https://corsproxy.io/?https://api.quotable.io/random?tags=technology,inspirational'
      );
      const data = response.data;
      setQuote({ content: data.content, author: data.author });
    } catch (err) {
      setError('Could not load quote.');
      console.error('Quote API error:', err);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  // ❌ Error State
  if (error) {
    return (
      <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow-md transition-colors duration-300">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  // 🔄 Loading Skeleton
  if (!quote) {
    return (
      <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow-md transition-colors duration-300 animate-pulse space-y-4">
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 ml-auto"></div>
      </div>
    );
  }

  // ✅ Loaded Quote
  return (
    <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow-md transition-colors duration-300">
      <blockquote className="text-gray-700 dark:text-gray-100 italic">"{quote.content}"</blockquote>
      <p className="mt-4 text-right text-sm text-gray-500 dark:text-gray-400">— {quote.author}</p>
    </div>
  );
};

export default QuoteBox;
