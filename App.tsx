
import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import Home from './pages/Home';
import DocumentViewer from './pages/DocumentViewer';

// DocumentViewer Wrapper para capturar params da URL
const DocumentViewerWrapper: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    
    const handleBack = () => {
        navigate('/');
    };
    
    // DocumentViewer mantém toda a lógica existente de busca/cache
    return <DocumentViewer documentId={id!} onBack={handleBack} />;
};

// App principal com rotas
const App: React.FC = () => {
    return (
        <BrowserRouter>
            <div className="bg-gray-100 min-h-screen font-sans">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/document/:id" element={<DocumentViewerWrapper />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
};

export default App;