/**
 * Three-point-style lighting tuned for clear glass: a soft key, a cool rim
 * light to catch the far edge of the bowl, and a low ambient fill so the
 * glass never goes fully black against the dark UI.
 */
export function Lighting() {
  return (
    <>
      <ambientLight intensity={0.25} />
      <directionalLight
        position={[3, 4, 2]}
        intensity={1.4}
        color="#fff3e0"
      />
      <directionalLight
        position={[-3, 2, -2]}
        intensity={0.6}
        color="#c9dcff"
      />
      <pointLight position={[0, -1.5, 2]} intensity={0.3} color="#e0c383" />
    </>
  );
}
