import QRCode from 'react-qr-code';

interface QRCodeDisplayProps {
  generateQrCode: () => void;
  qrCodeData: string | null;
  isDisabled: boolean;
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  generateQrCode,
  qrCodeData,
  isDisabled,
}) => (
  <div className="absolute top-4 right-4 flex flex-col items-center">
    <button
      onClick={generateQrCode}
      className={`bg-blue-500 text-white py-2 px-6 rounded-lg ${
        isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
      }`}
      disabled={isDisabled}
    >
      Generate QR
    </button>
    {qrCodeData && (
      <div className="mt-4 bg-white p-2 shadow-md rounded border-4">
        <QRCode value={qrCodeData} size={180} />
      </div>
    )}
  </div>
);

export default QRCodeDisplay;
