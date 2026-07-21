export function Lighting() {
  return (
    <>
      <ambientLight intensity={0.6} color="#ffffff" />
      <directionalLight
        position={[4, 6, 4]}
        intensity={1.8}
        color="#fff9f0"
      />
      <directionalLight
        position={[-4, 3, -3]}
        intensity={0.8}
        color="#e4ebf5"
      />
      <pointLight position={[0, -1, 3]} intensity={0.4} color="#c8d0bf" />
    </>
  );
}
