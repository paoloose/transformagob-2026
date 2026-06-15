import { useRef, useCallback, useState, useEffect } from "react";

interface BirdCameraProps {
  onCapture: (photoDataUrl: string) => void;
  onClose: () => void;
  mode?: "photo" | "video";
}

export function BirdCamera({ onCapture, onClose, mode = "photo" }: BirdCameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState(false);
  const [recording, setRecording] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setStreaming(true);
        }
      } catch {
        setError(true);
      }
    })();
    return () => {
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const takePhoto = useCallback(() => {
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

  const handleRecord = useCallback(() => {
    setRecording(true);
    setCountdown(3);
  }, []);

  useEffect(() => {
    if (countdown === null) return;
    if (countdown === 0) {
      setCountdown(null);
      takePhoto();
      return;
    }
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, takePhoto]);

  if (error) {
    return (
      <div className="bird-camera">
        <p style={{ color: "white", textAlign: "center", marginTop: "40vh" }}>
          No se pudo acceder a la cámara
        </p>
        <button onClick={onClose} type="button" style={{ color: "white", marginTop: "1rem" }}>
          Volver
        </button>
      </div>
    );
  }

  return (
    <div className="bird-camera">
      <video ref={videoRef} autoPlay playsInline muted />
      <canvas ref={canvasRef} style={{ display: "none" }} />
      {streaming && (
        <div className="bird-camera-controls">
          <button onClick={onClose} type="button" className="camera-close-btn">✕</button>
          {mode === "photo" ? (
            <button onClick={takePhoto} className="capture-btn" type="button">📷</button>
          ) : (
            <button onClick={handleRecord} className={`capture-btn ${recording ? "capture-btn-recording" : ""}`} type="button" disabled={recording}>
              {countdown !== null ? countdown : recording ? "⏺" : "⏺"}
            </button>
          )}
        </div>
      )}
      {countdown !== null && (
        <div className="countdown-overlay">{countdown}</div>
      )}
    </div>
  );
}