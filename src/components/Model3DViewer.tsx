import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import type { GLTF } from "three-stdlib";

interface ModelProps {
  url: string;
}

function Model({ url }: ModelProps) {
  const { scene } = useGLTF(url) as GLTF;
  return <primitive object={scene} scale={1.5} />;
}

interface Model3DViewerProps {
  modelUrl: string;
}

export function Model3DViewer({ modelUrl }: Model3DViewerProps) {
  return (
    <div className="model-3d-viewer">
      <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Suspense fallback={null}>
          <Model url={modelUrl} />
        </Suspense>
        <OrbitControls enableZoom={true} enablePan={false} />
      </Canvas>
    </div>
  );
}