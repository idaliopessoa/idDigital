
import React, { useState, useEffect, useCallback } from 'react';
import { DocumentData } from '../types';
import * as firebaseService from '../services/firebaseService';
import * as apiService from '../services/apiService';
import Spinner from '../components/Spinner';
import ErrorDisplay from '../components/ErrorDisplay';
import DocumentSlider from '../components/DocumentSlider';

interface DocumentViewerProps {
  documentId: string;
  onBack: () => void;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ documentId, onBack }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [documentData, setDocumentData] = useState<DocumentData | null>(null);

  const fetchDocument = useCallback(async (id: string) => {
    console.log(`VIEWER: Starting fetch process for document ID: ${id}`);
    setLoading(true);
    setError(null);

    try {
      console.log("VIEWER: Step 1 - Checking Firebase cache...");
      const docExists = await firebaseService.checkDocumentExists(id);

      if (docExists) {
        console.log("VIEWER: Document found in Firebase cache. Loading from there.");
        const data = await firebaseService.getDocument(id);
        if (data) {
          setDocumentData(data);
          console.log("VIEWER: Successfully set document data from cache.");
        } else {
           console.error("VIEWER: Document existed in cache but could not be retrieved.");
           throw new Error("Document existed in cache but could not be retrieved.");
        }
      } else {
        console.log("VIEWER: Document not in cache. Starting API fetch process.");
        
        console.log("VIEWER: Step 2 - Getting Auth Token from API...");
        const token = await apiService.getAuthToken();
        console.log("VIEWER: Auth Token received.");

        console.log("VIEWER: Step 3 - Getting Document Data from API...");
        const apiRawData = await apiService.getDocumentData(id, token);
        console.log("VIEWER: Raw document data received from API.");

        console.log("VIEWER: Step 4 - Transforming API data...");
        const processedData = apiService.transformApiData(apiRawData, id);
        console.log("VIEWER: API data transformed.");

        console.log("VIEWER: Step 5 - Saving processed data to Firebase...");
        await firebaseService.saveDocument(id, processedData);
        console.log("VIEWER: Document saved to Firebase cache.");
        
        console.log("VIEWER: Step 6 - Retrieving final data from Firebase to ensure consistency...");
        const finalData = await firebaseService.getDocument(id);
        setDocumentData(finalData);
        console.log("VIEWER: Final data set. Fetch process complete.");
      }
    } catch (err: any) {
      console.error("VIEWER: CATCH BLOCK - An error occurred during the fetch process.", err);
      setError(err.message || 'An unknown error occurred.');
    } finally {
      console.log("VIEWER: FINALLY BLOCK - Setting loading to false.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (documentId) {
      fetchDocument(documentId);
    } else {
       console.error("VIEWER: No document ID provided in props.");
       setError("No document ID provided.");
       setLoading(false);
    }
  }, [fetchDocument, documentId]);

  const renderContent = () => {
    if (loading) {
      return <Spinner />;
    }
    if (error) {
      return <ErrorDisplay message={error} />;
    }
    if (documentData) {
      return <DocumentSlider data={documentData} />;
    }
    return <ErrorDisplay message="Document could not be loaded." />;
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative">
        <button
            onClick={onBack}
            className="absolute top-4 left-4 z-20 bg-white/80 backdrop-blur-md text-brand-primary font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-white transition-all flex items-center gap-2"
            aria-label="New Search"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Nova Pesquisa
        </button>
        <div className="w-full h-full flex items-center justify-center">
            {renderContent()}
        </div>
    </div>
  );
};

export default DocumentViewer;