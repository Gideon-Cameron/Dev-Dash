// src/components/LoadingScreen.tsx
const LoadingScreen = () => {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="text-center space-y-4 animate-pulse">
          <h1 className="text-4xl font-bold text-blue-500">DevDash</h1>
          <p className="text-gray-600 dark:text-gray-400">Preparing your dashboard...</p>
        </div>
      </div>
    );
  };
  
  export default LoadingScreen;
  