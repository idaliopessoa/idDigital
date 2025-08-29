import React, { useState, useEffect, useRef } from 'react';
import { DocumentData } from '../types';
import { QRCodeCanvas as QRCode } from 'qrcode.react';

interface DocumentBackProps {
  data: DocumentData;
  backgroundUrl?: string;
  forceRotation?: boolean;
}

const DocumentBack: React.FC<DocumentBackProps> = ({ 
  data, 
  backgroundUrl = '/assets/verso.jpg',
  forceRotation = false
}) => {
  const [bgImageError, setBgImageError] = useState(false);
  const [containerHeight, setContainerHeight] = useState(0);
  const [shouldRotate, setShouldRotate] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const updateDimensions = () => {
      const isMobileLayout = window.innerWidth < 768 || window.innerHeight > window.innerWidth;
      const newShouldRotate = forceRotation || isMobileLayout;
      setShouldRotate(newShouldRotate);
      
      if (containerRef.current) {
        if (newShouldRotate) {
          // On mobile/vertical layouts, the card is rotated. Its width becomes dependent on the viewport height.
          const calculatedHeight = window.innerHeight * 0.65;
          setContainerHeight(calculatedHeight);
        } else {
          // On desktop/horizontal layouts, the card is not rotated.
          const containerWidth = containerRef.current.offsetWidth;
          setContainerHeight(containerWidth);
        }
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    window.addEventListener('orientationchange', updateDimensions);
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
      window.removeEventListener('orientationchange', updateDimensions);
    };
  }, [forceRotation]);


  // Renderiza o conteúdo do documento
  const DocumentContent = () => (
    <div className="absolute inset-0 rounded-xl shadow-2xl overflow-hidden">
      {/* Imagem de fundo */}
      <img 
        src={backgroundUrl}
        alt="ABRID Background"
        className="absolute inset-0 w-full h-full object-cover"
        onError={() => setBgImageError(true)}
        style={bgImageError ? { display: 'none' } : {}}
      />
      
      {/* Fallback se imagem falhar */}
      {bgImageError && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50" />
      )}
      
      {/* Container para campos */}
      <div className="absolute inset-0" style={{ fontFamily: 'Arial, sans-serif' }}>
        
        {/* QR Code */}
        <div 
          className="absolute bg-white p-1 rounded"
          style={{
            top: '7%',
            left: '4%',
          }}
        >
          <QRCode 
            value={data.id || 'ABRID-' + Date.now()} 
            size={shouldRotate ? 120 : 170} 
            level="Q"
          />
        </div>
        
        {/* Data de Nascimento */}
        <div style={{
          position: 'absolute',
          top: '45%',
          left: '8%',
          color: '#000'
        }}>
          <div style={{ 
            fontSize: shouldRotate ? '10px' : '12px', 
            opacity: 0.6,
            marginBottom: '1px',
            fontWeight: 'normal'
          }}>
            Data de Nascimento
          </div>
          <div style={{ 
            fontSize: shouldRotate ? '14px' : '20px', 
            fontWeight: 'bold'
          }}>
            {data.dataNascimento || '00/00/0000'}
          </div>
        </div>
        
        {/* Naturalidade */}
        <div style={{
          position: 'absolute',
          top: '45%',
          left: '58%',
          color: '#000'
        }}>
          <div style={{ 
            fontSize: shouldRotate ? '10px' : '12px', 
            opacity: 0.6,
            marginBottom: '1px',
            fontWeight: 'normal'
          }}>
            Naturalidade
          </div>
          <div style={{ 
            fontSize: shouldRotate ? '14px' : '20px', 
            fontWeight: 'bold'
          }}>
            {data.naturalidade || 'São Paulo'}
          </div>
        </div>
        
        {/* Nacionalidade */}
        <div style={{
          position: 'absolute',
          top: '57%',
          left: '8%',
          color: '#000'
        }}>
          <div style={{ 
            fontSize: shouldRotate ? '10px' : '12px', 
            opacity: 0.6,
            marginBottom: '1px',
            fontWeight: 'normal'
          }}>
            Nacionalidade
          </div>
          <div style={{ 
            fontSize: shouldRotate ? '14px' : '20px', 
            fontWeight: 'bold'
          }}>
            {data.nacionalidade || 'BRASILEIRA'}
          </div>
        </div>
        
        {/* Local e Data de Expedição */}
        <div style={{
          position: 'absolute',
          top: '57%',
          left: '58%',
          color: '#000'
        }}>
          <div style={{ 
            fontSize: shouldRotate ? '10px' : '12px', 
            opacity: 0.6,
            marginBottom: '1px',
            fontWeight: 'normal'
          }}>
            Local e Data de Expedição
          </div>
          <div style={{ 
            fontSize: shouldRotate ? '14px' : '20px', 
            fontWeight: 'bold'
          }}>
            {data.localDataExpedicao || 'Brasília/DF - 00/00/0000'}
          </div>
        </div>
               
      </div>
    </div>
  );

  // Renderização condicional baseada em rotação
  if (shouldRotate) {
    // Versão rotacionada para mobile/vertical
    return (
      <div className="w-full relative" style={{ paddingTop: '150%' }}>
        <div 
          className="h-full w-full absolute top-0 right-0 flex items-center justify-center" 
          ref={containerRef}
        >
          <div 
            className="transform -rotate-90 relative flex-shrink-0 transition-all duration-300"
            style={{ 
              width: `${containerHeight}px`,
              opacity: containerHeight > 0 ? 1 : 0
            }}
          >
            <div className="relative w-full" style={{ paddingTop: '63.08%' }}>
              <DocumentContent />
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    // Versão horizontal para desktop
    return (
      <div className="relative w-full max-w-[856px] mx-auto" ref={containerRef}>
        <div className="relative w-full" style={{ paddingTop: '63.08%' }}>
          <DocumentContent />
        </div>
      </div>
    );
  }
};

export default DocumentBack;