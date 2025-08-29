
import React from 'react';

interface ErrorDisplayProps {
  message: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center text-white p-4">
        <div className="bg-red-500/80 backdrop-blur-sm p-8 rounded-lg shadow-2xl border border-red-300">
            <h2 className="text-2xl font-bold mb-2">An Error Occurred</h2>
            <p className="text-lg">{message}</p>
        </div>
    </div>
  );
};

export default ErrorDisplay;
