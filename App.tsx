
import React, { useState } from 'react';
import DocumentViewer from './pages/DocumentViewer';

interface HomeProps {
    onSearch: (id: string) => void;
}

const Home: React.FC<HomeProps> = ({ onSearch }) => {
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue.trim()) {
            onSearch(inputValue.trim());
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center text-gray-800 p-4">
            <div className="bg-white/80 backdrop-blur-md p-8 sm:p-12 rounded-2xl shadow-xl border border-gray-200/50 max-w-md w-full">
                <h1 className="text-3xl sm:text-4xl font-bold mb-3 text-brand-primary">Document Verifier</h1>
                <p className="text-lg sm:text-xl mb-6 text-gray-600">
                    Enter the document ID below to view its details.
                </p>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Enter Document ID"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-primary transition-shadow"
                        aria-label="Document ID Input"
                    />
                    <button
                        type="submit"
                        disabled={!inputValue.trim()}
                        className="w-full bg-brand-primary text-white font-bold py-3 rounded-lg hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
                        aria-label="View Document"
                    >
                        View Document
                    </button>
                </form>
            </div>
        </div>
    );
};


const App: React.FC = () => {
  const [documentId, setDocumentId] = useState<string | null>(null);

  const handleSearch = (id: string) => {
    setDocumentId(id);
  };

  const handleBack = () => {
    setDocumentId(null);
  };

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      {documentId ? (
        <DocumentViewer documentId={documentId} onBack={handleBack} />
      ) : (
        <Home onSearch={handleSearch} />
      )}
    </div>
  );
};

export default App;