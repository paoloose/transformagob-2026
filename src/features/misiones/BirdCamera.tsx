import { useRef, useCallback, useState } from "react";

interface BirdCameraProps {
  onCapture: (photoDataUrl: string) => void;
  onClose: () => void;
}

export function BirdCamera({ onCapture, onClose }: BirdCameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [streaming, setStreaming] = useState(false);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setStreaming(true);
      }
    } catch {
      onClose();
    }
  }, [onClose]);

  const capture = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
    const stream = video.srcObject as MediaStream;
    stream.getTracks().forEach((t) => t.stop());
    onCapture(dataUrl);
  }, [onCapture]);

  return (
    <div className="bird-camera">
      <video ref={videoRef} autoPlay playsInline onLoadedMetadata={startCamera} />
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <div className="bird-camera-controls">
        <button onClick={onClose} type="button">✕</button>
        <button onClick={capture} className="capture-btn" type="button" disabled={!streaming}>
          📷
        </button>
      </div>
    </div>
  );
}