import React, { useRef, useCallback, useState } from 'react';
import Webcam from 'react-webcam';
import { Button } from '@/components/ui/button';
import { verifyFaces } from '@/utils/faceVerification';
import { Camera } from 'lucide-react';

interface WebcamCaptureProps {
  onCapture: (imageDataUrl: string) => void;
  onConfirm?: () => void;
  className?: string;
}

const WebcamCapture: React.FC<WebcamCaptureProps> = ({
  onCapture,
  onConfirm,
  className
}) => {
  const webcamRef = useRef<Webcam>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [verificationResult, setVerificationResult] = useState<{
    success: boolean;
    confidence?: number;
    error?: string;
  } | null>(null);
  const [isUsingDemo, setIsUsingDemo] = useState(false);

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user"
  };

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setPreviewImage(imageSrc);
      onCapture(imageSrc);
    }
  }, [onCapture]);

  const retakePhoto = () => {
    setPreviewImage(null);
  };

  return (
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
      {!previewImage ? (
        <div className="relative">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            className="rounded-lg border-2 border-gray-300"
          />
          
          <div className="absolute inset-0 rounded-lg border-2 border-dashed border-primary/50 pointer-events-none">
            <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-primary"></div>
            <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-primary"></div>
            <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-primary"></div>
            <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-primary"></div>
          </div>
          
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white px-3 py-1 rounded text-sm">
            Position your face within the frame
          </div>
        </div>
      ) : (
        <div className="relative">
          <img 
            src={previewImage} 
            alt="Captured" 
            className="rounded-lg border-2 border-gray-300 max-w-md"
          />
        </div>
      )}

      <div className="flex gap-3">
        {!previewImage ? (
          <Button 
            onClick={capture}
            variant="default"
          >
            <Camera className="w-4 h-4 mr-2" />
            Take Photo
          </Button>
        ) : (
          <div className="flex gap-3">
            <Button 
              onClick={retakePhoto}
              variant="outline"
            >
              Retake Photo
            </Button>
            <Button 
              onClick={onConfirm}
              variant="default"
            >
              Continue
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WebcamCapture;
