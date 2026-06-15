import { useRef, useState } from "react";

interface AudioPlayerProps {
  src: string;
  label: string;
}

export function AudioPlayer({ src, label }: AudioPlayerProps) {
  const ref = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    if (!ref.current) return;
    if (playing) {
      ref.current.pause();
    } else {
      ref.current.play();
    }
    setPlaying(!playing);
  };

  return (
    <div className="audio-player">
      <button className="audio-player-btn" onClick={toggle} type="button">
        {playing ? "⏸" : "🔊"} {label}
      </button>
      <audio ref={ref} src={src} onEnded={() => setPlaying(false)} preload="none" />
    </div>
  );
}