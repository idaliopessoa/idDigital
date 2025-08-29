import React from 'react';
import { QRCodeCanvas as QRCode } from 'qrcode.react';

interface DocumentQRProps {
  documentId: string;
}

const DocumentQR: React.FC<DocumentQRProps> = ({ documentId }) => {
  const qrValue = JSON.stringify({
    id: documentId,
    type: 'DigitalId'
  });

  return (
    <div className="w-full aspect-[63/100] max-h-full rounded-2xl shadow-xl overflow-hidden flex flex-col justify-center items-center p-6 bg-white border border-gray-200/50">
      <div className="text-center">
          <h2 className="text-xl font-serif text-doc-text-primary mb-2">Validação Digital</h2>
          <p className="text-sm text-gray-500 mb-6">Aponte a câmera de um dispositivo para o código QR para verificar a autenticidade deste documento.</p>
      </div>
      <div className="p-4 bg-white rounded-lg shadow-inner border border-gray-100">
        <QRCode 
          value={qrValue} 
          size={320} 
          bgColor="#ffffff"
          fgColor="#000000"
          level="H"
          includeMargin={true}
        />
      </div>
    </div>
  );
};

export default DocumentQR;