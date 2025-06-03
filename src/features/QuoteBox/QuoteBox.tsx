import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

// ✅ Define the shape of a quote
interface Quote {
  content: string;
  author: string;
}

const QuoteBox = () => {
  // ✅ useState with types
  const [quote, setQuote] = useState<Quote | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // 🧠 useCallback to prevent function recreation on every render
  const fetchQuote = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get<Quote>(
        'https://corsproxy.io/?https://api.quotable.io/random?tags=technology,inspirational'
      );

      const data = response.data;

      // ✅ Set quote in state
      setQuote({ content: data.content, author: data.author });
    } catch (err) {
      setError('Could not load quote.');
      console.error('Quote API error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 🚀 Fetch quote on initial render
  useEffect(() => {
    fetchQuote();
  }, [fetchQuote]);

  // ❌ Error state with retry option
  if (error) {
    return (
      <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow-md transition-colors duration-300 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={fetchQuote}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  // 🔄 Loading skeleton
  if (loading) {
    return (
      <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow-md transition-colors duration-300 animate-pulse space-y-4">
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 ml-auto"></div>
      </div>
    );
  }

  // ✅ Render quote when loaded
  return (
    <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow-md transition-colors duration-300">
      <figure>
        <blockquote className="text-gray-700 dark:text-gray-100 italic">
          "{quote?.content}"
        </blockquote>
        <figcaption className="mt-4 text-right text-sm text-gray-500 dark:text-gray-400">
          — {quote?.author}
        </figcaption>
      </figure>
    </div>
  );
};

export default QuoteBox;
