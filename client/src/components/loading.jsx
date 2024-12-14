// components/LoadingSpinner.jsx


const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-red-600 border-solid border-opacity-75"></div>
    </div>
  );
};

export default LoadingSpinner;
