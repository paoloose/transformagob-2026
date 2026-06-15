import { Suspense, useRef, useEffect, useState, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { createXRStore, XR, IfInSessionMode, useXRHitTest, XRDomOverlay } from "@react-three/xr";
import type { GLTF } from "three-stdlib";
import * as THREE from "three";

interface ModelProps {
  url: string;
}

function Model({ url }: ModelProps) {
  const { scene } = useGLTF(url) as GLTF;

  const { position, scale } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    
    const scaleFactor = maxDim > 0 ? 1.5 / maxDim : 1;
    
    return {
      scale: scaleFactor,
      position: [
        -center.x * scaleFactor,
        -box.min.y * scaleFactor,
        -center.z * scaleFactor
      ] as const
    };
  }, [scene]);

  const clonedScene = useMemo(() => scene.clone(), [scene]);

  return (
    <group position={position} scale={scale}>
      <primitive object={clonedScene} />
    </group>
  );
}

function ARLoading() {
  return (
    <mesh>
      <boxGeometry args={[0.3, 0.3, 0.3]} />
      <meshStandardMaterial color="#4dbfa0" wireframe />
    </mesh>
  );
}

const hitMatrix = new THREE.Matrix4();
const hitPos = new THREE.Vector3();

function ARPlacedModel({ url }: { url: string }) {
  const ref = useRef<THREE.Group>(null);

  useXRHitTest((results, getWorldMatrix) => {
    if (results.length === 0) return;
    getWorldMatrix(hitMatrix, results[0]);
    hitPos.setFromMatrixPosition(hitMatrix);
    if (ref.current) {
      ref.current.position.lerp(hitPos, 0.3);
      ref.current.position.y += 0.3;
    }
  }, "viewer");

  return (
    <group ref={ref} position={[0, 0, -2]}>
      <Suspense fallback={<ARLoading />}>
        <Model url={url} />
      </Suspense>
    </group>
  );
}

interface ARViewerProps {
  modelUrl: string;
  onClose: () => void;
}

export function ARViewer({ modelUrl, onClose }: ARViewerProps) {
  const [arSupported, setArSupported] = useState<"checking" | "yes" | "no">("checking");
  const [fallbackStreaming, setFallbackStreaming] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const store = useMemo(
    () =>
      createXRStore({
        offerSession: "immersive-ar",
        enterGrantedSession: true,
        hand: false,
      }),
    [],
  );

  useEffect(() => {
    if ("xr" in navigator) {
      navigator.xr!.isSessionSupported("immersive-ar").then((ok) => {
        setArSupported(ok ? "yes" : "no");
      }).catch(() => setArSupported("no"));
    } else {
      setArSupported("no");
    }
  }, []);

  useEffect(() => {
    // If WebXR is supported, we still might want to fall back to the camera if they don't enter AR immediately
    // but the original logic only triggered fallback if arSupported === 'no'.
    // We keep the original logic to respect the WebXR preference.
    if (arSupported !== "no") return;
    let stream: MediaStream | null = null;
    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setFallbackStreaming(true);
        }
      } catch {
        onClose();
      }
    })();
    return () => {
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [arSupported, onClose]);

  if (arSupported === "checking") {
    return (
      <div className="ar-viewer">
        <button className="ar-close-btn" onClick={onClose} type="button">✕</button>
        <p style={{ color: "white", textAlign: "center", marginTop: "40vh" }}>Verificando AR…</p>
      </div>
    );
  }

  if (arSupported === "yes") {
    return (
      <div className="ar-viewer">
        <button className="ar-close-btn" onClick={onClose} type="button" style={{ zIndex: 100 }}>✕</button>
        
        {/* ADDED BUTTON TO ENTER AR */}
        <div style={{ position: "absolute", bottom: 40, width: "100%", display: "flex", justifyContent: "center", zIndex: 10 }}>
          <button 
            onClick={() => store.enterAR()}
            style={{ padding: "12px 24px", background: "#4dbfa0", color: "white", borderRadius: 8, border: "none", fontWeight: "bold", fontSize: 16, cursor: "pointer" }}
          >
            Entrar a AR
          </button>
        </div>

        <Canvas gl={{ antialias: true }} camera={{ position: [0, 0, 4], fov: 50 }}>
          <XR store={store}>
            <ambientLight intensity={0.8} />
            <directionalLight position={[5, 5, 5]} intensity={1.5} />
            <directionalLight position={[-3, 2, -2]} intensity={0.4} />
            <IfInSessionMode allow="immersive-ar">
              <ARPlacedModel url={modelUrl} />
              <XRDomOverlay>
                <div style={{ position: "fixed", inset: 0, pointerEvents: "none" }}>
                  <button
                    className="ar-close-btn"
                    onClick={onClose}
                    type="button"
                    style={{ pointerEvents: "auto" }}
                  >
                    ✕
                  </button>
                  <div className="ar-hint">AR — Apunta al suelo</div>
                </div>
              </XRDomOverlay>
            </IfInSessionMode>
            <IfInSessionMode allow="inline">
              <Suspense fallback={<ARLoading />}>
                <Model url={modelUrl} />
              </Suspense>
              <OrbitControls enableZoom enablePan={false} />
            </IfInSessionMode>
          </XR>
        </Canvas>
      </div>
    );
  }

  return (
    <div className="ar-viewer">
      <video ref={videoRef} autoPlay playsInline muted className="ar-viewer-bg" />
      {fallbackStreaming && (
        <div className="ar-viewer-model">
          <Canvas
            camera={{ position: [0, 0, 4], fov: 50 }}
            gl={{ alpha: true, antialias: true }}
            onCreated={({ gl }) => {
              gl.setClearColor(new THREE.Color(0x000000), 0);
            }}
          >
            <ambientLight intensity={0.8} />
            <directionalLight position={[5, 5, 5]} intensity={1.5} />
            <directionalLight position={[-3, 2, -2]} intensity={0.4} />
            <Suspense fallback={<ARLoading />}>
              <Model url={modelUrl} />
            </Suspense>
            <OrbitControls enableZoom enablePan={false} />
          </Canvas>
        </div>
      )}
      <button className="ar-close-btn" onClick={onClose} type="button">✕</button>
      <div className="ar-hint">AR — Toca y arrastra para rotar</div>
    </div>
  );
}