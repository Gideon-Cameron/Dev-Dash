// src/features/DevQuoteBox/DevQuoteBox.tsx
import { useMemo } from 'react';

interface Quote {
  content: string;
  author: string;
}

const quotes: Quote[] = [
  { content: "Programs must be written for people to read, and only incidentally for machines to execute.", author: "Harold Abelson" },
  { content: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.", author: "Martin Fowler" },
  { content: "First, solve the problem. Then, write the code.", author: "John Johnson" },
  { content: "The only way to learn a new programming language is by writing programs in it.", author: "Dennis Ritchie" },
  { content: "Talk is cheap. Show me the code.", author: "Linus Torvalds" },
  { content: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
  { content: "Before software can be reusable it first has to be usable.", author: "Ralph Johnson" },
];

const DevQuoteBox = () => {
  const today = new Date().toDateString();

  const quote = useMemo(() => {
    const index = Math.abs(today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % quotes.length;
    return quotes[index];
  }, [today]);

  return (
    <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow-md transition-colors duration-300">
      <p className="mb-4 text-xl font-semibold text-gray-800 dark:text-gray-100 text-center">
        Daily Quote
      </p>
      <blockquote className="text-gray-700 dark:text-gray-300 italic text-center">
        “{quote.content}”
      </blockquote>
      <p className="mt-4 text-right text-sm text-gray-500 dark:text-gray-400">— {quote.author}</p>
    </div>
  );
};

export default DevQuoteBox;
