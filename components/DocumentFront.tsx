import React, { useState, useEffect, useRef } from 'react';
import { DocumentData } from '../types';

interface DocumentFrontProps {
  data: DocumentData;
  backgroundUrl?: string;
  forceRotation?: boolean; // Permite forçar rotação independente do dispositivo
}

const DocumentFront: React.FC<DocumentFrontProps> = ({ 
  data, 
  backgroundUrl = '/assets/frente.jpg',
  forceRotation = false
}) => {
  const [bgImageError, setBgImageError] = useState(false);
  const [faceImageError, setFaceImageError] = useState(false);
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
        
        {/* Foto do titular */}
        <div 
          className="absolute bg-white rounded-sm overflow-hidden"
          style={{
            top: '38%',
            left: '4.5%',
            width: '23%',
            height: '45%',
          }}
        >
          {data.imagemFace && !faceImageError ? (
            <img 
              src={data.imagemFace}
              alt="Foto"
              className="w-full h-full object-cover"
              onError={() => setFaceImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-50">
              <svg className="w-6 h-6 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
              </svg>
            </div>
          )}
        </div>
        
        {/* NOME */}
        <div style={{
          position: 'absolute',
          top: '33.5%',
          left: '31%',
          color: '#000',
          maxWidth: '50%'
        }}>
          <div style={{ 
            fontSize: shouldRotate ? '10px' : '12px', 
            opacity: 0.6,
            marginBottom: '1px',
            fontWeight: 'normal'
          }}>
            Nome
          </div>
          <div style={{ 
            fontSize: shouldRotate ? '14px' : '20px', 
            fontWeight: 'bold',
            lineHeight: '1.2',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {data.nomeCompleto || 'NOME DO TITULAR'}
          </div>
        </div>
        
        {/* FILIAÇÃO */}
        <div style={{
          position: 'absolute',
          top: '43.5%',
          left: '31%',
          color: '#000',
          maxWidth: '50%'
        }}>
          <div style={{ 
            fontSize: shouldRotate ? '10px' : '12px', 
            opacity: 0.6,
            marginBottom: '1px',
            fontWeight: 'normal'
          }}>
            Filiação
          </div>
          <div style={{ 
            fontSize: shouldRotate ? '14px' : '20px', 
            lineHeight: '1.3' ,
            fontWeight: 'bold'
          }}>
            <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {data.filiacao1 || 'Nome do Pai/Mãe'}
            </div>
            <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {data.filiacao2 || 'Nome do Pai/Mãe'}
            </div>
          </div>
        </div>
        
        {/* INFLUENCIADOR DIGITAL */}
        <div style={{
          position: 'absolute',
          top: '58.5%',
          left: '31%',
          color: '#000'
        }}>
          <div style={{ 
            fontSize: shouldRotate ? '10px' : '12px', 
            opacity: 0.6,
            marginBottom: '1px',
            fontWeight: 'normal'
          }}>
            Influenciador Digital MTE/CBO
          </div>
          <div style={{ 
            fontSize: shouldRotate ? '14px' : '20px', 
            fontWeight: 'bold' 
          }}>
             {data.numeroInfluenciador || '0000-00'}
          </div>
        </div>
        
        {/* DATA DE EMISSÃO */}
        <div style={{
          position: 'absolute',
          top: '58.5%',
          right: '10%',
          color: '#000',
          textAlign: 'right'
        }}>
          <div style={{ 
            fontSize: shouldRotate ? '10px' : '12px', 
            opacity: 0.6,
            marginBottom: '1px',
            fontWeight: 'normal'
          }}>
            Data de Emissão
          </div>
          <div style={{ 
            fontSize: shouldRotate ? '14px' : '20px', 
            fontWeight: 'bold' 
          }}>
            {data.dataEmissao || '00/00/0000'}
          </div>
        </div>
        
        {/* CPF */}
        <div style={{
          position: 'absolute',
          top: '68.5%',
          left: '31%',
          color: '#000'
        }}>
          <div style={{ 
            fontSize: shouldRotate ? '10px' : '12px', 
            opacity: 0.6,
            marginBottom: '1px',
            fontWeight: 'normal'
          }}>
            CPF
          </div>
          <div style={{ 
            fontSize: shouldRotate ? '18px' : '22px', 
            fontWeight: 'bold',
            letterSpacing: '0.3px'
          }}>
            {data.cpf || '000.000.000-00'}
          </div>
        </div>
        
        {/* RG/UF */}
        <div style={{
          position: 'absolute',
          top: '68.5%',
          right: '10%',
          color: '#000',
          textAlign: 'right'
        }}>
          <div style={{ 
            fontSize: shouldRotate ? '10px' : '12px', 
            opacity: 0.6,
            marginBottom: '1px',
            fontWeight: 'bold'
          }}>
            RG / UF
          </div>
          <div style={{ 
            fontSize: shouldRotate ? '14px' : '20px', 
            fontWeight: 'bold' 
          }}>
            {data.rgUf || '00000000-0'}
          </div>
        </div>
        
        {/* Assinatura do Titular */}
        <div style={{
          position: 'absolute',
          bottom: '4%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '56%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <div style={{ 
            width: '100%', 
            height: shouldRotate ? '72px' : '100px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '2px'
          }}>
            {data.imagemAssinatura ? (
              <img 
                src={data.imagemAssinatura}
                alt="Assinatura"
                style={{ 
                  maxHeight: '100%',
                  maxWidth: '100%',
                  objectFit: 'contain',
                }}
              />
            ) : (
              <div style={{
                width: '100%',
                borderBottom: '1px dotted rgba(0,0,0,0.3)'
              }} />
            )}
          </div>
          <span style={{
            fontSize: shouldRotate ? '7px' : '9px',
            color: 'rgba(0,0,0,0.6)',
            textTransform: 'uppercase',
            letterSpacing: '0.3px'
          }}>
            Assinatura do Titular
          </span>
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

export default DocumentFront;